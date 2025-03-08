""" Commandes de l'application """
from .app import app, db
import random


@app.cli.command()
def syncdb():
    '''Creates all missing tables.'''
    db.create_all()
    print("ok")

@app.cli.command()
def generate_inserts():
    inserts = []
    question_id = 1
    for questionnaire_id in range(1, 6):
        inserts.append(f"INSERT INTO questionnaire (id, name) VALUES ({questionnaire_id}, 'Questionnaire {questionnaire_id}');")
        for _ in range(3):
            title = f"Question {questionnaire_id} {question_id}"
            question_type = random.choice(["text", "multiple"])
            inserts.append(f"INSERT INTO question (id, title, questionType, questionnaire_id) VALUES ({question_id}, '{title}', '{question_type}', {questionnaire_id});")
            inserts.append(f"INSERT INTO question_{question_type} (id) VALUES ({question_id});")
            question_id += 1
    with open("server/script.sql", "w") as file:
        file.write("\n".join(inserts) + "\n")
    print("Les requêtes INSERT ont été généré")