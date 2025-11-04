from marshmallow import Schema, fields, validate

class UserSchema(Schema):
    email = fields.Email(required=True,
                         error_messages={'required':"Email is Required!"})
    password = fields.String(required=True,
                            validate=validate.Length(min=6, max=16,
                            error = "Password must be 6 to 16 characters!"))
    
user_schema = UserSchema()
    