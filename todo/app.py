from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import os.path

app = Flask (__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = ('sqlite:///'+"myapp.db")
db = SQLAlchemy(app)
