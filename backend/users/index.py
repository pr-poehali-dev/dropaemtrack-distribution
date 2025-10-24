'''
Business: Users management API - profiles, settings, notifications preferences
Args: event with httpMethod, body, queryStringParameters
Returns: HTTP response with user data
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
        
        if method == 'GET':
            user_id = params.get('id')
            username = params.get('username')
            role = params.get('role')
            
            if user_id:
                cur.execute(
                    """SELECT u.*, 
                       COUNT(DISTINCT t.id) as total_tracks,
                       SUM(t.streams) as total_streams,
                       SUM(t.revenue) as total_revenue
                       FROM users u
                       LEFT JOIN tracks t ON u.id = t.user_id
                       WHERE u.id = %s
                       GROUP BY u.id""",
                    (int(user_id),)
                )
                row = cur.fetchone()
                result = dict(row) if row else None
            elif username:
                cur.execute(
                    """SELECT * FROM users WHERE username = %s""",
                    (username,)
                )
                row = cur.fetchone()
                result = dict(row) if row else None
            else:
                query = """SELECT u.*, 
                           COUNT(DISTINCT t.id) as total_tracks
                           FROM users u
                           LEFT JOIN tracks t ON u.id = t.user_id
                           WHERE 1=1"""
                params_list = []
                
                if role:
                    query += " AND u.role = %s"
                    params_list.append(role)
                
                query += " GROUP BY u.id ORDER BY u.created_at DESC"
                
                cur.execute(query, params_list)
                result = [dict(row) for row in cur.fetchall()]
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            
            cur.execute(
                """INSERT INTO users (email, username, full_name, role, bio, avatar_url)
                   VALUES (%s, %s, %s, %s, %s, %s)
                   RETURNING *""",
                (body_data['email'], body_data['username'], body_data.get('full_name'),
                 body_data.get('role', 'artist'), body_data.get('bio'), body_data.get('avatar_url'))
            )
            conn.commit()
            result = dict(cur.fetchone())
        
        elif method == 'PUT':
            body_data = json.loads(event.get('body', '{}'))
            user_id = body_data.get('id')
            
            update_fields = []
            params_list = []
            
            for field in ['full_name', 'bio', 'avatar_url', 'role', 'paypal_email', 'bank_account', 
                         'telegram_id', 'telegram_notifications', 'email_notifications', 'push_notifications']:
                if field in body_data:
                    update_fields.append(f"{field} = %s")
                    params_list.append(body_data[field])
            
            if update_fields:
                update_fields.append("updated_at = CURRENT_TIMESTAMP")
                params_list.append(user_id)
                
                query = f"UPDATE users SET {', '.join(update_fields)} WHERE id = %s RETURNING *"
                cur.execute(query, params_list)
                conn.commit()
                result = dict(cur.fetchone())
            else:
                result = {'error': 'No fields to update'}
        
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
