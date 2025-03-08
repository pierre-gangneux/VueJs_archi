""" Création de l'application """
import os.path
# pylint: disable=import-error
from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

app = Flask (__name__)
cors = CORS(app, resources = {r"/api/*": {'origins': '*' }})
def mkpath(p):
    """Permet de créer un chemin absolue de la base de données

    Args:
        p (String): chemin de la base de données

    Returns:
        String: chemin absolue vers la base de données
    """
    return os.path.normpath(os.path.join(os.path.dirname(__file__), p))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///'+mkpath('myapp.db')
db = SQLAlchemy(app)
