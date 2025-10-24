'''
Business: Universal API for tracks management - CRUD, moderation, search, filters
Args: event with httpMethod, body, queryStringParameters
Returns: HTTP response with tracks data
'''

import json
import os
from typing import Dict, Any, List, Optional
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime

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
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        if method == 'GET':
            params = event.get('queryStringParameters') or {}
            track_id = params.get('id')
            user_id = params.get('user_id')
            status = params.get('status')
            genre = params.get('genre')
            search = params.get('search')
            sort_by = params.get('sort_by', 'upload_date')
            order = params.get('order', 'DESC')
            
            if track_id:
                cur.execute(
                    "SELECT * FROM tracks WHERE id = %s",
                    (int(track_id),)
                )
                track = cur.fetchone()
                result = dict(track) if track else None
            else:
                query = "SELECT t.*, u.username, u.full_name FROM tracks t LEFT JOIN users u ON t.user_id = u.id WHERE 1=1"
                params_list = []
                
                if user_id:
                    query += " AND t.user_id = %s"
                    params_list.append(int(user_id))
                
                if status:
                    query += " AND t.status = %s"
                    params_list.append(status)
                
                if genre:
                    query += " AND t.genre = %s"
                    params_list.append(genre)
                
                if search:
                    query += " AND (t.title ILIKE %s OR t.artist ILIKE %s)"
                    search_param = f"%{search}%"
                    params_list.extend([search_param, search_param])
                
                query += f" ORDER BY t.{sort_by} {order}"
                
                cur.execute(query, params_list)
                tracks = cur.fetchall()
                result = [dict(track) for track in tracks]
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            
            cur.execute(
                """INSERT INTO tracks 
                   (user_id, title, artist, genre, bpm, key, mood, audio_url, cover_url, duration, status, metadata)
                   VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                   RETURNING *""",
                (
                    body_data.get('user_id'),
                    body_data['title'],
                    body_data['artist'],
                    body_data.get('genre'),
                    body_data.get('bpm'),
                    body_data.get('key'),
                    body_data.get('mood'),
                    body_data.get('audio_url'),
                    body_data.get('cover_url'),
                    body_data.get('duration'),
                    body_data.get('status', 'pending'),
                    json.dumps(body_data.get('metadata', {}))
                )
            )
            conn.commit()
            track = cur.fetchone()
            result = dict(track)
        
        elif method == 'PUT':
            body_data = json.loads(event.get('body', '{}'))
            track_id = body_data.get('id')
            
            update_fields = []
            params_list = []
            
            for field in ['title', 'artist', 'genre', 'bpm', 'key', 'mood', 'status', 'rejection_reason', 'streams', 'revenue']:
                if field in body_data:
                    update_fields.append(f"{field} = %s")
                    params_list.append(body_data[field])
            
            if update_fields:
                update_fields.append("updated_at = CURRENT_TIMESTAMP")
                params_list.append(track_id)
                
                query = f"UPDATE tracks SET {', '.join(update_fields)} WHERE id = %s RETURNING *"
                cur.execute(query, params_list)
                conn.commit()
                track = cur.fetchone()
                result = dict(track) if track else None
            else:
                result = {'error': 'No fields to update'}
        
        elif method == 'DELETE':
            params = event.get('queryStringParameters') or {}
            track_id = params.get('id')
            
            cur.execute("UPDATE tracks SET status = 'rejected' WHERE id = %s RETURNING *", (int(track_id),))
            conn.commit()
            track = cur.fetchone()
            result = dict(track) if track else None
        
        else:
            result = {'error': 'Method not allowed'}
            cur.close()
            conn.close()
            return {
                'statusCode': 405,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(result),
                'isBase64Encoded': False
            }
        
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
