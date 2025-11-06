import os
from flask import Flask
from src.extensions import mongo
from src.extensions import bcrypt
from src.extensions import mail
from dotenv import load_dotenv
from src.blueprints.users import users_bp

def create_app():
    app = Flask(__name__)
    load_dotenv()
    app.config['MONGO_URI'] = os.getenv("MONGODB_URI")
    
    # configuration of mail
    app.config['MAIL_SERVER']='smtp.gmail.com'
    app.config['MAIL_PORT'] = os.getenv('MAIL_PORT')
    app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
    app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
    app.config['MAIL_USE_TLS'] = False
    app.config['MAIL_USE_SSL'] = True
    
    bcrypt.init_app(app)
    
    mail.init_app(app)
    # Initialize the mongo extension with the app here
    mongo.init_app(app)

    # Register blueprints or routes here
    app.register_blueprint(users_bp, url_prefix="/api/users")
    
    return app

app = create_app()


@app.route('/')
def home():
    return {"msg": "Welcome to Fitflab"}

    

if __name__ == '__main__':
    app.run(debug=True)
    


