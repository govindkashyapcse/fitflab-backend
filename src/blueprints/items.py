from flask import request, jsonify, Blueprint
from ..schemas.Item import food_schema, meal_schema, diet_schema
from marshmallow import ValidationError
from ..extensions import mongo
from ..middlewares.auth import auth_user
from ..constants import Role
from bson.objectid import ObjectId


items_bp = Blueprint('items', __name__)

@items_bp.route('/add-food', methods=['POST'])
@auth_user(Role.EDITOR)
def addFood():
    try:
        food = food_schema.load(request.json)
        food_name = food.get('name', "")
        if mongo.db.foods.find_one({"name": food_name}):
            return jsonify({"message": "Food item already exists!"})
        res = mongo.db.foods.insert_one(food)
        if res:
            return jsonify({"message": "Food added successfully."})
        return jsonify({"error": "Food can not be added."})
    except ValidationError as err:
        return jsonify(err.messages), 400

@items_bp.route('/delete/<food_id>', methods=['DELETE'])
@auth_user(Role.EDITOR)
def deleteFood(food_id):
    res = mongo.db.foods.delete_one({"_id": ObjectId(food_id)})
    if res.deleted_count == 1:
        return jsonify({"message":f"Successfully deleted document with ID: {food_id}"})
    else:
        return jsonify({"error":f"No document found with ID: {food_id} or deletion failed"})