from flask_bcrypt import Bcrypt
from flask_pymongo import PyMongo
from flask_mail import Mail
from flask_cors import CORS
from redis import Redis
import os

mongo = PyMongo()
bcrypt = Bcrypt()
mail = Mail()
cors = CORS()
redis = Redis(
    host=os.getenv('REDIS_HOST'),
    port=os.getenv('REDIS_PORT'),
    decode_responses=True,
    username=os.getenv('REDIS_USERNAME'),
    password=os.getenv('REDIS_PASSWORD')
)