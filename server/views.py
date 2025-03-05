from flask import jsonify , abort , make_response , request, Flask, url_for, redirect
from .app import app, db
from .models import (
    Questionnaire,
    Question,
    getQuestionnaires,
    get_questionnaire,
    get_questions_questionnaire,
    get_questions,
    get_question,
    delete_question_row,
    delete_questionnaire_row,
    edit_question_row,
    edit_questionnaire_row,
    new_question
)
    


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
    print(questionnaire)
    if questionnaire is None:
        # Le questionnaire n'existe pas
        abort(404)
    return jsonify(questionnaire), 200

@app.route("/api/questions", methods = ['GET'])
def questions():
    return jsonify(get_questions()), 200

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

# Ajouter des questions et des questionnaires #

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
    questionnaire = questionnaire.to_json()
    questionnaire["uri"] = "/api/questionnaire/"+str(questionnaire["id"])+"/questions"
    return jsonify(questionnaire), 201

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
    question = new_question(request.json)
    if question is None:
        abort(400)
    return jsonify(question.to_json()), 201

# Modifier les questions et les questionnaires #

# curl -i -H "Content-Type: application/json" -X PUT -d '{"questionnaire_id":1,"name":"new_name"}' http://localhost:5000/api/questionnaires
@app.route("/api/questionnaires", methods = ["PUT"])
def edit_questionnaire():
    """Permet de modifier un questionnaire

    Returns:
        json: le json du questionnaire une fois modifier
    """
    if not request.json or not 'questionnaire_id' in request.json or len(request.json) <= 1:
        abort(400)
    questionnaire = edit_questionnaire_row(request.json)
    if questionnaire is None:
        abort(404)
    questionnaire["uri"] = "/api/questionnaire/"+str(questionnaire["id"])+"/questions"
    return jsonify(questionnaire), 200

# curl -i -H "Content-Type: application/json" -X PUT -d '{"question_id":1, "title":"testQ", "type":"text", "questionnaire_id":1}' http://localhost:5000/api/questions
@app.route("/api/questions", methods = ['PUT'])
def edit_question():
    """Permet de modifier une question

    Returns:
        json: le json de la question une fois modifier
    """
    if not request.json or not 'question_id' in request.json or len(request.json) <= 1:
        abort(400)
    question = edit_question_row(request.json)
    if question is None:
        abort(404)
    return jsonify(question), 200

# Supprimer les questions et les questionnaires #

# curl -i -H "Content-Type: application/json" -X DELETE -d '{"questionnaire_id":"1"}' http://localhost:5000/api/questionnaires
@app.route("/api/questionnaires", methods = ["DELETE"])
def delete_questionnaire():
    """Permet de supprimer un questionnaire

    Returns:
        json: le json du questionnaire une fois supprimer
    """
    if not request.json or not 'questionnaire_id' in request.json:
        abort(400)
    questionnaire = delete_questionnaire_row(request.json["questionnaire_id"])
    if questionnaire is None:
        abort(404)
    return jsonify(questionnaire), 200

# curl -i -H "Content-Type: application/json" -X DELETE -d '{"question_id":"2"}' http://localhost:5000/api/questions
@app.route("/api/questions", methods = ['DELETE'])
def delete_question():
    """Permet de supprimer une question

    Returns:
        json: le json de la question une fois supprimer
    """
    if not request.json or not 'question_id' in request.json:
        abort(400)
    question = delete_question_row(request.json["question_id"])
    if question is None:
        abort(404)
    return jsonify(question), 200

# Handler error #

@app.errorhandler(404)
def not_found(error):
    """Erreur déclencher lorsque la ressource n'existe

    Args:
        error (error): l'erreur

    Returns:
        json: Une description de l'erreur
    """
    return make_response(jsonify({'error': 'Not found'}), 404)

@app.errorhandler(400)
def not_found(error):
    """Erreur déclencher lorsque la requête n'est pas bien formulée

    Args:
        error (error): l'erreur

    Returns:
        json: Une description de l'erreur
    """
    return make_response(jsonify({'error': 'Bad request'}), 400)
