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
            'name':self.name
        }
        return json
    
    def get_questions(self):
        return Question.query.filter(Question.questionnaire_id == self.id).all()

def getQuestionnaires():
    return [questionnaire.to_json() for questionnaire in Questionnaire.query.all()]

def get_questionnaire(questionnaire_id):
    return Questionnaire.query.filter(Questionnaire.id == questionnaire_id).first()

def get_next_id_Questionnaire():
    max_id = db.session.query(func.max(Questionnaire.id)).scalar()
    next_id = (max_id or 0) + 1
    return next_id


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

def get_questions(id_questionnaire):
    questions = Question.query.filter(Question.questionnaire_id == id_questionnaire).all()
    if questions is None:
        return None
    return [question.to_json() for question in questions]

def get_question():
    questionnaire = Quy.query.filter(Questionnaire.id == questionnaire_id).first()
    if questionnaire is None:
        return None
    return questionnaire.to_json()