'''
Business: Labels and releases management API - create labels, manage artists, schedule releases
Args: event with httpMethod, body, queryStringParameters
Returns: HTTP response with labels and releases data
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
        resource = params.get('resource', 'labels')
        
        if method == 'GET':
            if resource == 'labels':
                label_id = params.get('label_id')
                user_id = params.get('user_id')
                
                if label_id:
                    cur.execute(
                        """SELECT l.*, 
                           array_agg(json_build_object(
                             'user_id', u.id,
                             'username', u.username,
                             'full_name', u.full_name,
                             'role', la.role
                           )) as artists
                           FROM labels l
                           LEFT JOIN label_artists la ON l.id = la.label_id
                           LEFT JOIN users u ON la.user_id = u.id
                           WHERE l.id = %s
                           GROUP BY l.id""",
                        (int(label_id),)
                    )
                    row = cur.fetchone()
                    result = dict(row) if row else None
                elif user_id:
                    cur.execute(
                        """SELECT l.*, COUNT(la.user_id) as artist_count
                           FROM labels l
                           LEFT JOIN label_artists la ON l.id = la.label_id
                           WHERE l.owner_id = %s OR la.user_id = %s
                           GROUP BY l.id""",
                        (int(user_id), int(user_id))
                    )
                    result = [dict(row) for row in cur.fetchall()]
                else:
                    cur.execute(
                        """SELECT l.*, COUNT(la.user_id) as artist_count
                           FROM labels l
                           LEFT JOIN label_artists la ON l.id = la.label_id
                           GROUP BY l.id"""
                    )
                    result = [dict(row) for row in cur.fetchall()]
            
            elif resource == 'releases':
                user_id = params.get('user_id')
                start_date = params.get('start_date')
                end_date = params.get('end_date')
                
                query = """SELECT r.*, t.title, t.artist, t.cover_url, u.username
                           FROM releases r
                           JOIN tracks t ON r.track_id = t.id
                           JOIN users u ON r.user_id = u.id
                           WHERE 1=1"""
                params_list = []
                
                if user_id:
                    query += " AND r.user_id = %s"
                    params_list.append(int(user_id))
                
                if start_date:
                    query += " AND r.release_date >= %s"
                    params_list.append(start_date)
                
                if end_date:
                    query += " AND r.release_date <= %s"
                    params_list.append(end_date)
                
                query += " ORDER BY r.release_date ASC"
                
                cur.execute(query, params_list)
                result = [dict(row) for row in cur.fetchall()]
            
            else:
                result = {'error': 'Unknown resource'}
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            
            if resource == 'labels':
                cur.execute(
                    """INSERT INTO labels (owner_id, name, description, logo_url, website)
                       VALUES (%s, %s, %s, %s, %s)
                       RETURNING *""",
                    (body_data['owner_id'], body_data['name'], body_data.get('description'), 
                     body_data.get('logo_url'), body_data.get('website'))
                )
                conn.commit()
                result = dict(cur.fetchone())
            
            elif resource == 'label_artists':
                cur.execute(
                    """INSERT INTO label_artists (label_id, user_id, role)
                       VALUES (%s, %s, %s)
                       ON CONFLICT (label_id, user_id) DO UPDATE SET role = EXCLUDED.role
                       RETURNING *""",
                    (body_data['label_id'], body_data['user_id'], body_data.get('role', 'artist'))
                )
                conn.commit()
                result = dict(cur.fetchone())
            
            elif resource == 'releases':
                cur.execute(
                    """INSERT INTO releases (track_id, user_id, release_date, platforms, promotional_plan, status)
                       VALUES (%s, %s, %s, %s, %s, %s)
                       RETURNING *""",
                    (body_data['track_id'], body_data['user_id'], body_data['release_date'],
                     json.dumps(body_data.get('platforms', [])), body_data.get('promotional_plan'),
                     body_data.get('status', 'scheduled'))
                )
                conn.commit()
                result = dict(cur.fetchone())
            
            else:
                result = {'error': 'Unknown resource'}
        
        elif method == 'PUT':
            body_data = json.loads(event.get('body', '{}'))
            
            if resource == 'labels':
                update_fields = []
                params_list = []
                
                for field in ['name', 'description', 'logo_url', 'website']:
                    if field in body_data:
                        update_fields.append(f"{field} = %s")
                        params_list.append(body_data[field])
                
                if update_fields:
                    params_list.append(body_data['id'])
                    query = f"UPDATE labels SET {', '.join(update_fields)}, updated_at = CURRENT_TIMESTAMP WHERE id = %s RETURNING *"
                    cur.execute(query, params_list)
                    conn.commit()
                    result = dict(cur.fetchone())
                else:
                    result = {'error': 'No fields to update'}
            
            elif resource == 'releases':
                update_fields = []
                params_list = []
                
                for field in ['release_date', 'platforms', 'promotional_plan', 'status']:
                    if field in body_data:
                        if field == 'platforms':
                            update_fields.append(f"{field} = %s")
                            params_list.append(json.dumps(body_data[field]))
                        else:
                            update_fields.append(f"{field} = %s")
                            params_list.append(body_data[field])
                
                if update_fields:
                    params_list.append(body_data['id'])
                    query = f"UPDATE releases SET {', '.join(update_fields)}, updated_at = CURRENT_TIMESTAMP WHERE id = %s RETURNING *"
                    cur.execute(query, params_list)
                    conn.commit()
                    result = dict(cur.fetchone())
                else:
                    result = {'error': 'No fields to update'}
            
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
