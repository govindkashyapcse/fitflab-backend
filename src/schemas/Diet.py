from marshmallow import Schema, fields, validate


class FoodSchema(Schema):
    name = fields.String(required=True)
    photoURL = fields.String()
    nutrients = fields.Dict(required=True, 
            keys=fields.String(), values=fields.Float())
    servingSize = fields.Float(required=True)
    servingUnit = fields.String(required=True,
            validate=validate.OneOf(['ml','g','kg','l','qt','pt','tbsp']))
class MealSchema(Schema):
    name = fields.String(required=True)
    photoURL = fields.String()
    items = fields.List(fields.Dict(keys=fields.String(), 
                    values=fields.Integer()),required=True)
    calories = fields.Integer()
    macros = fields.Dict(keys=fields.String(), values=fields.Float())
    
class DietSchema(Schema):
    name = fields.String(required=True)
    targetCalories = fields.Integer(required=True)
    meals = fields.List(fields.String(), required=True)
    durationDays = fields.Integer(required=True)
    difficulty = fields.String(
        validate=validate.OneOf(['easy', 'moderate', 'difficult']))
    