from flask import jsonify , abort , make_response , request, Flask, url_for, redirect
from .app import app, db
from .models import Questionnaire, Question, getQuestionnaires, get_next_id_Questionnaire, get_questionnaire, get_questions


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
    questionnaire = get_questions(questionnaire_id)
    if questionnaire is None:
        # Le questionnaire n'existe pas
        abort(404)
    return jsonify(questionnaire), 200



@app.route("/api/question/<int:id_question>", methods = ['GET'])
def question(id_question:int):
    """Permet d'obtenir le json d'un question avec la méthode GET

    Args:
        id_question (int): l'id de la question que l'on veut récupérer

    Returns:
        json: la question
    """
    return jsonify(get_question(id_question)), 200

# Modifier les questions et les questionnaires

# Supprimer les questions et les questionnaires

@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'error': 'Not found'}), 404)

@app.errorhandler(400)
def not_found(error):
    return make_response(jsonify({'error': 'Bad request'}), 400)