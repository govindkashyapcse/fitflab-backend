from marshmallow import Schema, fields, validate

class UserSchema(Schema):
    email = fields.Email(required=True,
            error_messages={'required':"Email is Required!"})
    password = fields.String(required=True,
            validate=validate.Length(min=6, max=16,
            error = "Password must be 6 to 16 characters!"))
    role = fields.Integer()
    provider = fields.String(validate=validate.Length(max=50))

class ProfileSchema(Schema):
    userId = fields.String()
    name = fields.String(required=True)
    gender = fields.String(
            validate=validate.OneOf(['male','female','other']))
    dob = fields.DateTime(format="%d-%m-%Y")
    weight = fields.Float()
    height = fields.Float()
    bmi = fields.Float(dump_only=True)
    dietaryPreferences = fields.List(fields.String())
    alergies = fields.List(fields.String())
    

class GoalSchema(Schema):
    userId = fields.String(required=True)
    dailyCalories = fields.Integer(required=True)
    macrosGoal = fields.Dict(keys=fields.String(),
                            values=fields.Float())

    
class OTPSchema(Schema):
        email = fields.Email(required=True)
        otp = fields.Integer(required=True)


user_schema = UserSchema()
profile_schema = ProfileSchema()
goal_schema = GoalSchema()
otp_schema = OTPSchema()
    