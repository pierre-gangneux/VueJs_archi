from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import os.path

app = Flask (__name__)
cors = CORS(app, resources = {r"/api/*": {'origins': '*' }})
def mkpath (p):
    return os.path.normpath(os.path.join(os.path.dirname(__file__), p))
app.config['SQLALCHEMY_DATABASE_URI'] = ('sqlite:///'+mkpath('myapp.db'))
db = SQLAlchemy(app)
