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

    def set_name(self, name):
        self.name = name
    
    def get_questions(self):
        return Question.query.filter(Question.questionnaire_id == self.id).all()

def getQuestionnaires():
    return [questionnaire.to_json() for questionnaire in Questionnaire.query.all()]

def get_questionnaire(questionnaire_id):
    try:
        return Questionnaire.query.filter(Questionnaire.id == questionnaire_id).first()
    except:
        return None

def get_next_id_Questionnaire():
    max_id = db.session.query(func.max(Questionnaire.id)).scalar()
    next_id = (max_id or 0) + 1
    return next_id

def delete_questionnaire_row(id_questionnaire):
    questionnaire = Questionnaire.query.filter(Questionnaire.id == int(id_questionnaire)).first()
    if questionnaire is None:
        return None
    for question in questionnaire.get_questions():
        db.session.delete(question)
    db.session.delete(questionnaire)
    db.session.commit()
    return questionnaire.to_json()

def edit_questionnaire_row(json):
    questionnaire = Questionnaire.query.filter(Questionnaire.id == int(json["questionnaire_id"])).first()
    print(questionnaire)
    if questionnaire is None:
        return None
    if "name" in json:
        questionnaire.set_name(json["name"])
    db.session.commit()
    return questionnaire.to_json()

class Question(db.Model):

    __tablename__ = "question"

    id = db.Column(db.Integer, primary_key = True)
    title = db.Column(db.String(120))
    questionType = db.Column(db.String(120))
    questionnaire_id = db.Column(db.Integer, db.ForeignKey('questionnaire.id'))
    questionnaire = db.relationship("Questionnaire", backref=db.backref("questions", lazy="dynamic"))

    def __init__(self, title, questionType, questionnaire_id):
        self.id = get_next_id_Question()
        self.title = title
        self.questionType = questionType
        self.questionnaire_id = questionnaire_id

    def to_json(self):
        json = {
            'id':self.id,
            'title':self.title,
            'type':self.questionType
        }
        return json

    def set_title(self, title):
        self.title = title

    def set_type(self, type):
        self.questionType = type
    
    def set_questionnaire_id(self, id):
        self.questionnaire_id = id

def get_questions_questionnaire(id_questionnaire):
    try:
        return [question.to_json() for question in Question.query.filter(Question.questionnaire_id == id_questionnaire).all()]
    except:
        return None

def get_questions():
    return [question.to_json() for question in Question.query.all()]

def get_question(id_question):
    try:
        return Question.query.filter(Question.id == id_question).first().to_json()
    except:
        return None

def get_next_id_Question():
    max_id = db.session.query(func.max(Question.id)).scalar()
    next_id = (max_id or 0) + 1
    return next_id

def delete_question_row(id_question):
    question = Question.query.filter(Question.id == int(id_question)).first()
    if question is None:
        return None
    db.session.delete(question)
    db.session.commit()
    return question.to_json()

def edit_question_row(json):
    question = Question.query.filter(Question.id == int(json["question_id"])).first()
    if question is None:
        return None
    if "title" in json:
        question.set_title(json["title"])
    if "type" in json:
        question.set_type(json["type"])
    if "questionnaire_id" in json:
        question.set_questionnaire_id(json["questionnaire_id"])
    db.session.commit()
    return question.to_json()