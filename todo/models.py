from sqlalchemy import Column, DateTime, Float, Integer, Text, Date, Boolean, Time, extract, func, between
from sqlalchemy.orm import relationship
from sqlalchemy.sql.schema import ForeignKey
from .app import db

class Questionnaire(db.Model):
    
    __tablename__ = "questionnaire"

    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(100))

    def __init__(self, name):
        self.id = get_next_id_Questionnaire()
        self.name = name
    
    def __repr__(self):
        return "<Questionnaire (%d) %s>" % (self.id, self.name)

    def to_json(self):
        json = {
            'id':self.id,
            'name':self.name,
            'questions':[]
        }
        for question in self.get_questions():
            json['questions'].append(question.to_json())
        return json
    
    def get_questions(self):
        return Question.query.filter(Question.questionnaire_id == self.id).all()

class Question(db.Model):

    __tablename__ = "question"

    id = db.Column(db.Integer, primary_key = True)
    title = db.Column(db.String(120))
    questionType = db.Column(db.String(120))
    questionnaire_id = db.Column(db.Integer, db.ForeignKey('questionnaire.id'))
    questionnaire = db.relationship("Questionnaire", backref=db.backref("questions", lazy="dynamic"))

    def to_json(self):
        json = {
            'id':self.id,
            'title':self.title,
            'type':self.questionType
        }
        return json


def getQuestionnaires():
    return Questionnaire.query.all()

def getQuestionnairesJson():
    return [questionnaire.to_json() for questionnaire in Questionnaire.query.all()]

def get_next_id_Questionnaire():
    max_id = db.session.query(func.max(Questionnaire.id)).scalar()
    next_id = (max_id or 0) + 1
    return next_id








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