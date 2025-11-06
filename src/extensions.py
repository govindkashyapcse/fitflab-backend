from flask_bcrypt import Bcrypt
from flask_pymongo import PyMongo
from flask_mail import Mail
from flask_cors import CORS


mongo = PyMongo()
bcrypt = Bcrypt()
mail = Mail()
cors = CORS()