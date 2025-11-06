from marshmallow import Schema, fields, validate

class UserSchema(Schema):
    email = fields.Email(required=True,
                         error_messages={'required':"Email is Required!"})
    password = fields.String(required=True,
                            validate=validate.Length(min=6, max=16,
                            error = "Password must be 6 to 16 characters!"))

class ProfileSchema(Schema):
    userId = fields.String()
    name = fields.String(required=True)
    gender = fields.String(required=True,
                           validate=validate.OneOf(['male','female','other']))
    dob = fields.Date()
    weight = fields.Integer()
    height = fields.Integer()
    bmi = fields.Decimal(dump_only=True, places = 2)
    dietaryPreferences = fields.List(fields.String())
    alergies = fields.List(fields.String())


class GoalSchema(Schema):
    userId = fields.String(required=True)
    dailyCalories = fields.Integer(required=True)
    macrosGoal = fields.List(fields.Dict(keys=fields.String(),values=fields.Decimal()))
    


    
user_schema = UserSchema()
profile_schema = ProfileSchema()
goal_schema = GoalSchema()

    