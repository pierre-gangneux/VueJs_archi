from sqlalchemy import Column, DateTime, Float, Integer, Text, Date, Boolean, Time, extract, func, between
from sqlalchemy.orm import relationship
from sqlalchemy.sql.schema import ForeignKey
from .app import db

class Questionnaire(db.Model):
    
    __tablename__ = "questionnaire"

    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(100))

    def __init__(self, name):
        self.name = name
    
    def __repr__(self):
        return "<Questionnaire (%d) %s>" % (self.id, self.name)

    def to_json(self):
        json = {
            'id':self.id,
            'name':self.name
        }
        return json


class Question(db.Model):

    __tablename__ = "question"

    id = db.Column(db.Integer, primary_key = True)
    title = db.Column(db.String(120))
    questionType = db.Column(db.String(120))
    questionnaire_id = db.Column(db.Integer, db.ForeignKey('questionnaire.id'))
    questionnaire = db.relationship("Questionnaire", backref=db.backref("questions", lazy="dynamic"))


def getQuestionnaires():
    query = Questionnaire.query.all()
    print(query)
    return query










#tasks=[
#{
#'id':1,
#'title':'Courses',
#'description':'Salade,Oignons,Pommes,Clementines',
#'done':True
#},
#{
#'id':2,
#'title':'ApprendreREST',
#'description':'Apprendremoncoursetcomprendrelesexemples',
#'done':False
#},
#{
#'id':3,
#'title':'ApprendreAjax',
#'description':'RevoirlesexemplesetecrireunclientRESTJSavecAjax',
#'done':False
#}
#]