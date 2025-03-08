from flask import jsonify, abort, make_response, request, url_for, redirect
from .app import app, db
from .models import (
    Questionnaire,
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

# Récupérer des questions et des questionnaires #

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
        questionnaire_id (int): l'id du questionnaire

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
        questionnaire_id (int): l'id du questionnaire

    Returns:
        json: liste des questions du questionnaire
    """
    questionnaire = get_questions_questionnaire(questionnaire_id)
    if questionnaire is None:
        # Le questionnaire n'existe pas
        abort(404)
    return jsonify(questionnaire), 200

@app.route("/api/questionnaires/<int:questionnaire_id>/question/<int:id_question>", methods = ['GET'])
def question(questionnaire_id:int, id_question:int):
    """Permet d'obtenir le json d'un question avec la méthode GET

    Args:
        questionnaire_id (int): l'id du questionnaire
        id_question (int): l'id de la question

    Returns:
        json: la question
    """
    question = get_question(questionnaire_id, id_question)
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

# curl -i -H "Content-Type: application/json" -X POST -d '{"title":"testQ", "type":"text"}' http://localhost:5000/api/questionnaires/1/questions
@app.route("/api/questionnaires/<int:questionnaire_id>/questions", methods = ['POST'])
def create_question(questionnaire_id:int):
    """Permet de créer une question avec la méthode POST
    Nécessite un titre, un type et l'id d'un questionnaire pour créer la question

    Args:
        questionnaire_id (int): l'id du questionnaire

    Returns:
        json: la question une fois créer
    """
    if (
        not request.json
        or not 'title' in request.json 
        or not 'type' in request.json
    ):
        abort(400)
    question = new_question(questionnaire_id, request.json)
    if question is None:
        abort(400)
    return jsonify(question.to_json()), 201

# Modifier les questions et les questionnaires #

# curl -i -H "Content-Type: application/json" -X PUT -d '{"name":"new_name"}' http://localhost:5000/api/questionnaires/1
@app.route("/api/questionnaires/<int:questionnaire_id>", methods = ["PUT"])
def edit_questionnaire(questionnaire_id:int):
    """Permet de modifier un questionnaire

    Args:
        questionnaire_id (int): l'id du questionnaire

    Returns:
        json: le json du questionnaire une fois modifier
    """
    if not request.json:
        abort(400)
    questionnaire = edit_questionnaire_row(questionnaire_id, request.json)
    if questionnaire is None:
        abort(404)
    questionnaire["uri"] = "/api/questionnaire/"+str(questionnaire["id"])+"/questions"
    return jsonify(questionnaire), 200

# curl -i -H "Content-Type: application/json" -X PUT -d '{"title":"testQ", "type":"text"}' http://localhost:5000/api/questionnaires/1/questions/1
@app.route("/api/questionnaires/<int:questionnaire_id>/questions/<int:id_question>", methods = ['PUT'])
def edit_question(questionnaire_id:int, id_question:int):
    """Permet de modifier une question

    Args:
        questionnaire_id (int): l'id du questionnaire
        id_question (int): l'id de la question

    Returns:
        json: le json de la question une fois modifier
    """
    if not request.json:
        abort(400)
    question = edit_question_row(questionnaire_id, id_question, request.json)
    if question is None:
        abort(404)
    return jsonify(question), 200

# Supprimer les questions et les questionnaires #

# curl -i -H "Content-Type: application/json" -X DELETE http://localhost:5000/api/questionnaires/1
@app.route("/api/questionnaires/<int:questionnaire_id>", methods = ["DELETE"])
def delete_questionnaire(questionnaire_id:int):
    """Permet de supprimer un questionnaire

    Args:
        questionnaire_id (int): l'id du questionnaire

    Returns:
        json: le json du questionnaire une fois supprimer
    """
    questionnaire = delete_questionnaire_row(questionnaire_id)
    if questionnaire is None:
        abort(404)
    return jsonify(questionnaire), 200

# curl -i -H "Content-Type: application/json" -X DELETE http://localhost:5000/api/questionnaires/1/questions/1
@app.route("/api/questionnaires/<int:questionnaire_id>/questions/<int:id_question>", methods = ['DELETE'])
def delete_question(questionnaire_id:int, id_question:int):
    """Permet de supprimer une question

    Args:
        questionnaire_id (int): l'id du questionnaire
        id_question (int): l'id de la question

    Returns:
        json: le json de la question une fois supprimer
    """
    question = delete_question_row(questionnaire_id, id_question)
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
    return make_response(jsonify({'error': 'Not found - ' + error}), 404)

@app.errorhandler(400)
def not_found(error):
    """Erreur déclencher lorsque la requête n'est pas bien formulée

    Args:
        error (error): l'erreur

    Returns:
        json: Une description de l'erreur
    """
    return make_response(jsonify({'error': 'Bad request - ' + error}), 400)
