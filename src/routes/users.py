from flask import request, jsonify, Blueprint
from ..schemas.UserSchema import user_schema
from marshmallow import ValidationError
from ..database import mongo

users_bp = Blueprint('users', __name__)


@users_bp.route('/register', methods = ['POST'])
def addUser():
    try:
        data = user_schema.load(request.json)
        
        if mongo.db.users.find_one({"email": data['email']}):
            return jsonify({"message": "User Already Exists!"})
        else:
            res = mongo.db.users.insert_one(data)
            print(type(res))
            return {'id': str(res.inserted_id)}
        
    except ValidationError as err:
        return jsonify(err.messages)
    
    
