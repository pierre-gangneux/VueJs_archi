from sqlalchemy import Column, DateTime, Float, Integer, Text, Date, Boolean, Time, extract, func, between, ARRAY
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
    questionnaire = Questionnaire.query.filter(Questionnaire.id == id_questionnaire).first()
    if questionnaire is None:
        return None
    for question in questionnaire.get_questions():
        db.session.delete(question)
    db.session.delete(questionnaire)
    db.session.commit()
    return questionnaire.to_json()

def edit_questionnaire_row(questionnaire_id, json):
    questionnaire = Questionnaire.query.filter(Questionnaire.id == questionnaire_id).first()
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

    __mapper_args__ = {
        "polymorphic_identity": "question",
        "with_polymorphic": "*",
        "polymorphic_on": questionType
    }

    def __init__(self, title, questionnaire_id, id=None):
        if id is None:
            self.id = get_next_id_Question()
        self.id = id
        self.title = title
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
        if type in ["text", "multiple"]:
            if self.questionType == type:
                return self
            db.session.delete(self)
            db.session.commit()
            if type == "text":
                question = QuestionText(self.title, self.questionnaire_id, self.id)
            elif type == "multiple":
                question = QuestionMultiple(self.title, self.questionnaire_id, self.id)
            db.session.add(question)
            db.session.commit()
            return question

    
    def set_questionnaire_id(self, id):
        self.questionnaire_id = id

def get_questions_questionnaire(id_questionnaire):
    # try:
        return [question.to_json() for question in Question.query.filter(Question.questionnaire_id == id_questionnaire).all()]
    # except:
    #     return None

def get_questions():
    return [question.to_json() for question in Question.query.all()]

def get_question(questionnaire_id, id_question):
    try:
        return Question.query.filter(Question.id == id_question, Question.questionnaire_id == questionnaire_id).first().to_json()
    except:
        return None

def get_next_id_Question():
    max_id = db.session.query(func.max(Question.id)).scalar()
    next_id = (max_id or 0) + 1
    return next_id

def delete_question_row(questionnaire_id, id_question):
    question = Question.query.filter(Question.id == id_question, Question.questionnaire_id == questionnaire_id).first()
    if question is None:
        return None
    db.session.delete(question)
    db.session.commit()
    return question.to_json()

def edit_question_row(questionnaire_id, id_question, json):
    question = Question.query.filter(Question.id == id_question, Question.questionnaire_id == questionnaire_id).first()
    if question is None:
        return None
    if "type" in json:
        question = question.set_type(json["type"])
    if "title" in json:
        question.set_title(json["title"])
    db.session.commit()
    return question.to_json()


class QuestionText(Question):
    id = db.Column(db.Integer, db.ForeignKey('question.id'), primary_key=True)

    __mapper_args__ = {
        "polymorphic_identity": "text"
    }



class QuestionMultiple(Question):
    id = db.Column(db.Integer, db.ForeignKey('question.id'), primary_key=True)

    __mapper_args__ = {
        "polymorphic_identity": "multiple"
    }

def new_question(questionnaire_id, json):
    match json["type"]:
        case "text":
            question = QuestionText(json["title"], questionnaire_id)
        case "multiple":
            question = QuestionMultiple(json["title"], questionnaire_id)
        case _:
            question = QuestionText(json["title"], questionnaire_id)
    db.session.add(question)
    db.session.commit()
    return question