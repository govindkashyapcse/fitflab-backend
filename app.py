import os
from flask import Flask
from src.database import mongo
from dotenv import load_dotenv
from src.routes.users import users_bp

def create_app():
    app = Flask(__name__)
    load_dotenv()
    app.config['MONGO_URI'] = os.getenv("MONGODB_URI")

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