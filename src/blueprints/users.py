from flask import request, jsonify, Blueprint
from ..schemas.User import user_schema, profile_schema, otp_schema
from marshmallow import ValidationError
from flask_mail import Message
from ..extensions import mongo
from ..extensions import bcrypt
from ..extensions import mail
from ..extensions import redis
from random import randint
from ..middlewares.auth import generate_token, auth_user
from ..constants import Role


users_bp = Blueprint('users', __name__)

@users_bp.route('/signup', methods = ['POST'])
def signup():
    try:
        data = user_schema.load(request.json)
        hp = bcrypt.generate_password_hash(data['password']).decode('utf-8')
        data['password'] = hp
        email = data['email']
        password = data['password']
        if mongo.db.users.find_one({"email": email}):
            return jsonify({"message": "User Already Exists!"})
        else:
            msg = Message(
                            subject = 'Email verification for fitflab',
                            sender ='preplyft@gmail.com',
                            recipients = [email]
                        )
            otp = randint(1000,9999)
            msg.body = f'Your otp is {otp}'
            pipe = redis.pipeline()
            pipe.hset(email, "password", password)
            pipe.hset(email, "otp", otp)
            pipe.expire(email, 240)
            pipe.execute()
            mail.send(msg)
            return jsonify({"message": f"Verification mail sent to {email}"})
        
    except ValidationError as err:
        return jsonify(err.messages), 400
    
@users_bp.route('/login', methods = ['POST'])
def login():
    try:
        data = user_schema.load(request.json)
        res = mongo.db.users.find_one({"email": data['email']})
        if res:
            passwd = data['password'] 
            hash_pw = res['password'] 
            if bcrypt.check_password_hash(hash_pw, passwd):
                uid = str(res.get('_id', ""))
                urole = res.get('role', 0)
                token = generate_token(user_id=uid, user_role=urole)
                return jsonify({'token': token})
            else:
                return {"message": "Wrong Password!"}
        return {"message": "User Not Found!"}
    except ValidationError as err:
        return jsonify(err.messages), 400



@users_bp.route('/verify-otp', methods = ['POST'])
def verifyOTP():
    try:
        data = otp_schema.load(request.json)
        email = data['email']
        otp = data['otp']
        stored_data = redis.hgetall(email)
        stored_password = stored_data.get('password',"")
        stored_otp = stored_data.get('otp', None)
        
        if stored_otp and int(stored_otp) == otp:
            redis.delete(email)
            user = {
                 "email": email,
                 "password": stored_password,
                 "role": 1,
                 "provider": "Email"
            }
            res = mongo.db.users.insert_one(user)
            uid = str(res.inserted_id)
            urole = user.get('role', 0)
            token = generate_token(user_id=uid, user_role=urole)
            return jsonify({'token': token})
        return jsonify({"error": f"Entered OTP is not correct."}),401
    except ValidationError as err:
        return jsonify(err.messages), 400
    
@users_bp.route('/profile', methods = ['POST'])
@auth_user(Role.USER)
def profile():
    try:
        data = profile_schema.load(request.json)
        data['userId'] = request.user_id 
        res = mongo.db.profiles.insert_one(data)
        return jsonify({"id": res.inserted_id})
    except ValidationError as err:
        return jsonify(err.messages), 400

@users_bp.route('/protected_editor', methods=['GET'])
@auth_user(Role.EDITOR)
def protectedEditor():
    return jsonify({'message': f'Welcome, editor {request.user_id}'})

@users_bp.route('/protected', methods=['GET'])
@auth_user(Role.USER)
def protected():
    return jsonify({'message': f'Welcome, user {request.user_id}'})