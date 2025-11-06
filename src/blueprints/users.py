from flask import request, jsonify, Blueprint
from ..schemas.User import user_schema, profile_schema, goal_schema
from marshmallow import ValidationError
from flask_mail import Message
from ..extensions import mongo
from ..extensions import bcrypt
from ..extensions import mail

users_bp = Blueprint('users', __name__)

@users_bp.route('/signup', methods = ['POST'])
def signup():
    try:
        data = user_schema.load(request.json)
        hp = bcrypt.generate_password_hash(data['password']).decode('utf-8')
        data['password'] = hp
        if mongo.db.users.find_one({"email": data['email']}):
            return jsonify({"message": "User Already Exists!"})
        else:
            msg = Message(
                            subject = 'Email verification for fitflab',
                            sender ='preplyft@gmail.com',
                            recipients = [data['email']]
                        )
            otp = 345678
            msg.body = f'Your otp is {otp}'
            mail.send(msg)
            res = mongo.db.users.insert_one(data)
            return {'id': str(res.inserted_id)}
        
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
                return user_schema.dump(res)
            else:
                return {"message": "Wrong Password!"}
        return {"message": "User Not Found!"}
    except ValidationError as err:
        return jsonify(err.messages), 400

@users_bp.route('/profile', methods = ['POST'])
def profile():
    try:
        data = profile_schema.load(request.json)
        data['userId'] = "123456789" 
        res = mongo.db.users.insert_one(data)
        return jsonify({"id": res.inserted_id})
    except ValidationError as err:
        return jsonify(err.messages), 400
    