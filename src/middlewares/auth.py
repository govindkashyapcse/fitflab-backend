import jwt
from datetime import datetime, timedelta, timezone
from flask import request, jsonify
from functools import wraps
from flask import current_app as app

# Generate JWT Token (Valid for 15 days)
def generate_token(user_id, user_role):
    payload = {
        'user_id': user_id,
        'role': user_role,
        'exp': datetime.now(timezone.utc) + timedelta(days=15)
    }
    token = jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')
    return token


# Middleware for JWT verification
def auth_user(minimum_role):
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            token = None

            # Get token from "Authorization" header
            if 'Authorization' in request.headers:
                auth_header = request.headers['Authorization']
                if " " in auth_header:
                    token = auth_header.split(" ")[1]

            if not token:
                return jsonify({'error': 'Token is missing!'}), 401

            try:
                # Decode token
                data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
                
                # Verifying User Role
                user_role = data.get('role')
                if not user_role or user_role < minimum_role:
                    return jsonify({'error': 'Permission denied!'}), 403

                request.user_id = data.get('user_id', "")
            except jwt.ExpiredSignatureError:
                return jsonify({'error': 'Token has expired!'}), 401
            except jwt.InvalidTokenError:
                return jsonify({'error': 'Invalid token!'}), 401

            return f(*args, **kwargs)
        return decorated
    return decorator