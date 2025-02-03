from flask import jsonify , abort , make_response , request, Flask, url_for, redirect
from .app import app, db
from .models import Questionnaire, Question, getQuestionnaires, get_questionnaire, get_questions_questionnaire, get_questions, get_question


@app.route("/")
def home():
    return redirect(url_for("questionnaires"))

@app.route("/api/questionnaires", methods = ['GET'])
def questionnaires():
    """Permet d'obtenir la liste des questionnaires avec la méthode GET
    Un questionnaire est composé d'un identifiant, d'un nom 
    ainsi qu'une URI permettant d'obtenir les questions du questionnaire

    Returns:
        json: la liste des questionnaires
    """
    questionnaires = getQuestionnaires()
    for questionnaire in questionnaires:
        questionnaire["uri"] = "/api/questionnaire/"+str(questionnaire["id"])+"/questions"
    return jsonify(questionnaires), 200

# curl -i -H "Content-Type: application/json" -X POST -d '{"name":"test"}' http://localhost:5000/api/questionnaires
@app.route("/api/questionnaires", methods = ['POST'])
def create_questionnaires():
    """Permet de créer un questionnaire avec la méthode POST
    Nécessite un nom pour créer le questionnaire

    Returns:
        json: le questionnaire une fois créer
    """
    if not request.json or not 'name' in request.json:
        abort(400)
    questionnaire = Questionnaire(request.json["name"])
    db.session.add(questionnaire)
    db.session.commit()
    return jsonify(questionnaire.to_json()), 201

@app.route("/api/questionnaire/<int:questionnaire_id>", methods = ["GET"])
def questionnaire(questionnaire_id:int):
    """Permet obtenir un questionnaire en renseignant son id avec la méthode GET

    Args:
        questionnaire_id (int): l'id du questionnaire que l'on veut récupérer

    Returns:
        json: questionnaire
    """
    questionnaire = get_questionnaire(questionnaire_id)
    if questionnaire is None:
        # Le questionnaire n'existe pas
        abort(404)
    return jsonify(questionnaire), 200

@app.route("/api/questionnaire/<int:questionnaire_id>/questions", methods = ["GET"])
def questionnaire_questions(questionnaire_id:int):
    """Permet d'obtenir les questions d'un questionnaire avec la méthode GET

    Args:
        questionnaire_id (int): l'id du questionnaire contenant les questions

    Returns:
        json: liste des questions du questionnaire
    """
    questionnaire = get_questions_questionnaire(questionnaire_id)
    if questionnaire is None:
        # Le questionnaire n'existe pas
        abort(404)
    return jsonify(questionnaire), 200

@app.route("/api/questions", methods = ['GET'])
def questions():
    return jsonify(get_questions()), 200

# curl -i -H "Content-Type: application/json" -X POST -d '{"title":"testQ", "type":"text", "questionnaire_id":1}' http://localhost:5000/api/questions
@app.route("/api/questions", methods = ['POST'])
def create_question():
    """Permet de créer une question avec la méthode POST
    Nécessite un titre, un type et l'id d'un questionnaire pour créer la question

    Returns:
        json: la question une fois créer
    """
    if (
        not request.json
        or not 'title' in request.json 
        or not 'type' in request.json 
        or not 'questionnaire_id' in request.json 
        or get_questionnaire(request.json["questionnaire_id"]) is None
    ):
        abort(400)
    question = Question(request.json["title"], request.json["type"], request.json["questionnaire_id"])
    db.session.add(question)
    db.session.commit()
    return jsonify(question.to_json()), 201

@app.route("/api/question/<int:id_question>", methods = ['GET'])
def question(id_question:int):
    """Permet d'obtenir le json d'un question avec la méthode GET

    Args:
        id_question (int): l'id de la question que l'on veut récupérer

    Returns:
        json: la question
    """
    question = get_question(id_question)
    if question is None:
        # La question n'existe pas
        abort(404)
    return jsonify(question), 200

# Modifier les questions et les questionnaires

# Supprimer les questions et les questionnaires

# curl -i -H "Content-Type: application/json" -X DELETE -d '{"question_id":"2"}' http://localhost:5000/api/questions
@app.route("/api/questions", methods = ['DELETE'])
def delete_question():
    if not request.json or not 'question_id' in request.json:
        abort(400)
    print(type(request.json["question_id"]), request.json["question_id"])
    question = get_question(int(request.json["question_id"]))
    print(question)
    if question is None:
        # La question n'existe pas
        abort(404)
    db.session.remove(question)
    db.session.commit()
    return jsonify(question.to_json()), 200

# curl -i -H "Content-Type: application/json" -X DELETE -d '{"title":"testQ", "type":"text", "questionnaire_id":1}' http://localhost:5000/api/questions
@app.route("/api/questionnaires", methods = ["DELETE"])
def delete_questionnaire():
    if not request.json or not 'questionnaire_id' in request.json:
        abort(400)
    questionnaire = get_questionnaire(request.json["questionnaire_id"])
    if questionnaire is None:
        # Le questionnaire n'existe pas
        abort(404)
    for question in questionnaire.get_questions():
        db.session.remove(question)
    db.session.remove(questionnaire)
    db.session.commit()
    return jsonify(questionnaire.to_json()), 200


@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'error': 'Not found'}), 404)

@app.errorhandler(400)
def not_found(error):
    return make_response(jsonify({'error': 'Bad request'}), 400)