'''
Business: Analytics API - streams, revenue, geography, demographics data
Args: event with httpMethod, queryStringParameters for filtering
Returns: HTTP response with analytics data
'''

import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime, timedelta

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
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        params = event.get('queryStringParameters') or {}
        track_id = params.get('track_id')
        user_id = params.get('user_id')
        start_date = params.get('start_date')
        end_date = params.get('end_date')
        
        result = {}
        
        if track_id:
            cur.execute(
                """SELECT date, SUM(streams) as streams, SUM(revenue) as revenue
                   FROM analytics 
                   WHERE track_id = %s
                   GROUP BY date
                   ORDER BY date DESC
                   LIMIT 30""",
                (int(track_id),)
            )
            result['daily'] = [dict(row) for row in cur.fetchall()]
            
            cur.execute(
                """SELECT country, SUM(streams) as streams
                   FROM analytics 
                   WHERE track_id = %s
                   GROUP BY country
                   ORDER BY streams DESC
                   LIMIT 10""",
                (int(track_id),)
            )
            result['countries'] = [dict(row) for row in cur.fetchall()]
            
            cur.execute(
                """SELECT platform, SUM(streams) as streams, SUM(revenue) as revenue
                   FROM analytics 
                   WHERE track_id = %s
                   GROUP BY platform
                   ORDER BY streams DESC""",
                (int(track_id),)
            )
            result['platforms'] = [dict(row) for row in cur.fetchall()]
        
        elif user_id:
            cur.execute(
                """SELECT a.date, SUM(a.streams) as streams, SUM(a.revenue) as revenue
                   FROM analytics a
                   JOIN tracks t ON a.track_id = t.id
                   WHERE t.user_id = %s
                   GROUP BY a.date
                   ORDER BY a.date DESC
                   LIMIT 30""",
                (int(user_id),)
            )
            result['daily'] = [dict(row) for row in cur.fetchall()]
            
            cur.execute(
                """SELECT t.id, t.title, t.artist, SUM(a.streams) as total_streams, SUM(a.revenue) as total_revenue
                   FROM tracks t
                   JOIN analytics a ON t.id = a.track_id
                   WHERE t.user_id = %s
                   GROUP BY t.id, t.title, t.artist
                   ORDER BY total_revenue DESC
                   LIMIT 10""",
                (int(user_id),)
            )
            result['top_tracks'] = [dict(row) for row in cur.fetchall()]
            
            cur.execute(
                """SELECT SUM(streams) as total_streams, SUM(revenue) as total_revenue
                   FROM analytics a
                   JOIN tracks t ON a.track_id = t.id
                   WHERE t.user_id = %s""",
                (int(user_id),)
            )
            totals = cur.fetchone()
            result['totals'] = dict(totals) if totals else {'total_streams': 0, 'total_revenue': 0}
        
        else:
            cur.execute(
                """SELECT date, SUM(streams) as streams, SUM(revenue) as revenue
                   FROM analytics
                   GROUP BY date
                   ORDER BY date DESC
                   LIMIT 30"""
            )
            result['daily'] = [dict(row) for row in cur.fetchall()]
            
            cur.execute(
                """SELECT SUM(streams) as total_streams, SUM(revenue) as total_revenue
                   FROM analytics"""
            )
            totals = cur.fetchone()
            result['totals'] = dict(totals) if totals else {'total_streams': 0, 'total_revenue': 0}
        
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
