import click
from .app import app, db

@app.cli.command()
def syncdb():
    '''Creates all missing tables.'''
    print("ok")
    db.create_all()