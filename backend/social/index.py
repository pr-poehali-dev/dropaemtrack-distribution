'''
Business: Social features API - comments, messages, playlists, notifications
Args: event with httpMethod, body, queryStringParameters
Returns: HTTP response with social data
'''

import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    dsn = os.environ.get('DATABASE_URL')
    return psycopg2.connect(dsn, cursor_factory=RealDictCursor)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        params = event.get('queryStringParameters') or {}
        resource = params.get('resource', 'comments')
        
        if method == 'GET':
            if resource == 'comments':
                track_id = params.get('track_id')
                cur.execute(
                    """SELECT c.*, u.username, u.full_name, u.avatar_url
                       FROM comments c
                       JOIN users u ON c.user_id = u.id
                       WHERE c.track_id = %s
                       ORDER BY c.created_at DESC""",
                    (int(track_id),)
                )
                result = [dict(row) for row in cur.fetchall()]
            
            elif resource == 'messages':
                user_id = params.get('user_id')
                cur.execute(
                    """SELECT m.*, 
                       s.username as sender_username, s.full_name as sender_name,
                       r.username as receiver_username, r.full_name as receiver_name
                       FROM messages m
                       JOIN users s ON m.sender_id = s.id
                       JOIN users r ON m.receiver_id = r.id
                       WHERE m.sender_id = %s OR m.receiver_id = %s
                       ORDER BY m.created_at DESC
                       LIMIT 50""",
                    (int(user_id), int(user_id))
                )
                result = [dict(row) for row in cur.fetchall()]
            
            elif resource == 'playlists':
                user_id = params.get('user_id')
                playlist_id = params.get('playlist_id')
                
                if playlist_id:
                    cur.execute(
                        """SELECT p.*, 
                           array_agg(json_build_object(
                             'track_id', t.id,
                             'title', t.title,
                             'artist', t.artist,
                             'position', pt.position
                           ) ORDER BY pt.position) as tracks
                           FROM playlists p
                           LEFT JOIN playlist_tracks pt ON p.id = pt.playlist_id
                           LEFT JOIN tracks t ON pt.track_id = t.id
                           WHERE p.id = %s
                           GROUP BY p.id""",
                        (int(playlist_id),)
                    )
                    row = cur.fetchone()
                    result = dict(row) if row else None
                else:
                    cur.execute(
                        """SELECT p.*, COUNT(pt.track_id) as track_count
                           FROM playlists p
                           LEFT JOIN playlist_tracks pt ON p.id = pt.playlist_id
                           WHERE p.user_id = %s OR p.is_public = true
                           GROUP BY p.id
                           ORDER BY p.created_at DESC""",
                        (int(user_id),)
                    )
                    result = [dict(row) for row in cur.fetchall()]
            
            elif resource == 'notifications':
                user_id = params.get('user_id')
                cur.execute(
                    """SELECT * FROM notifications
                       WHERE user_id = %s
                       ORDER BY created_at DESC
                       LIMIT 50""",
                    (int(user_id),)
                )
                result = [dict(row) for row in cur.fetchall()]
            
            else:
                result = {'error': 'Unknown resource'}
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            
            if resource == 'comments':
                cur.execute(
                    """INSERT INTO comments (track_id, user_id, content, parent_id)
                       VALUES (%s, %s, %s, %s)
                       RETURNING *""",
                    (body_data['track_id'], body_data['user_id'], body_data['content'], body_data.get('parent_id'))
                )
                conn.commit()
                result = dict(cur.fetchone())
            
            elif resource == 'messages':
                cur.execute(
                    """INSERT INTO messages (sender_id, receiver_id, track_id, content)
                       VALUES (%s, %s, %s, %s)
                       RETURNING *""",
                    (body_data['sender_id'], body_data['receiver_id'], body_data.get('track_id'), body_data['content'])
                )
                conn.commit()
                result = dict(cur.fetchone())
            
            elif resource == 'playlists':
                cur.execute(
                    """INSERT INTO playlists (user_id, title, description, is_public)
                       VALUES (%s, %s, %s, %s)
                       RETURNING *""",
                    (body_data['user_id'], body_data['title'], body_data.get('description'), body_data.get('is_public', False))
                )
                conn.commit()
                result = dict(cur.fetchone())
            
            elif resource == 'playlist_tracks':
                cur.execute(
                    """INSERT INTO playlist_tracks (playlist_id, track_id, position)
                       VALUES (%s, %s, %s)
                       ON CONFLICT (playlist_id, track_id) DO UPDATE SET position = EXCLUDED.position
                       RETURNING *""",
                    (body_data['playlist_id'], body_data['track_id'], body_data['position'])
                )
                conn.commit()
                result = dict(cur.fetchone())
            
            elif resource == 'notifications':
                cur.execute(
                    """INSERT INTO notifications (user_id, type, title, message, link)
                       VALUES (%s, %s, %s, %s, %s)
                       RETURNING *""",
                    (body_data['user_id'], body_data['type'], body_data['title'], body_data['message'], body_data.get('link'))
                )
                conn.commit()
                result = dict(cur.fetchone())
            
            else:
                result = {'error': 'Unknown resource'}
        
        elif method == 'PUT':
            body_data = json.loads(event.get('body', '{}'))
            
            if resource == 'messages':
                cur.execute(
                    """UPDATE messages SET is_read = true
                       WHERE id = %s
                       RETURNING *""",
                    (body_data['id'],)
                )
                conn.commit()
                result = dict(cur.fetchone())
            
            elif resource == 'notifications':
                cur.execute(
                    """UPDATE notifications SET is_read = true
                       WHERE id = %s
                       RETURNING *""",
                    (body_data['id'],)
                )
                conn.commit()
                result = dict(cur.fetchone())
            
            else:
                result = {'error': 'Unknown resource'}
        
        else:
            result = {'error': 'Method not allowed'}
        
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps(result, default=str),
            'isBase64Encoded': False
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
