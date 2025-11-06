from marshmallow import Schema, fields, validate

class WorkoutSchema(Schema):
    name = fields.String(required=True)
    photoURL = fields.String(required=True)
    videoURL = fields.String()
    reps = fields.Integer(required=True)
    sets = fields.Integer(required=True)
    duration = fields.Integer(required=True)

class WorkoutSessionSchema(Schema):
    name = fields.String(required=True)
    workouts = fields.List(fields.String(), required=True)

class WorkoutPlanSchema(Schema):
    name = fields.String(required=True)
    workoutSessions = fields.List(fields.String(), required=True)
    durationWeeks = fields.Integer(required=True)
    intensity = fields.String(required=True,
        validate=validate.OneOf(['light', 'moderate', 'vigorous']))
    
class WorkoutLogSchema(Schema):
    userId = fields.String(required=True)
    workoutSessionId = fields.String(required=True)
    duration = fields.Integer(required=True)
    caloriesBurned = fields.Integer(required=True)
    