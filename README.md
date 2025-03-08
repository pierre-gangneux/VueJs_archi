# TD 1 - Architecture logicielle

Réalisé par Baptiste Mignan

## Installation

    make install

Si vous voulez charger des données

    make loaddb

## Lancement

    make run

## Détail des fonctionnalités

### API

#### Questionnaires

- GET /api/questionnaires
    
Récupère tous les questionnaires

- POST /api/questionnaires

Créer un questionnaire

- GET /api/questionnaires/<int:questionnaire_id>

Récupérer un questionnaire spécifique

- PUT /api/questionnaires/<int:questionnaire_id>

Modifier un questionnaire

- DELETE /api/questionnaires/<int:questionnaire_id>

Supprimer un questionnaire

#### Questions

- GET /api/questionnaires/<int:questionnaire_id>/questions

Récupérer toutes les questions d’un questionnaire

- POST /api/questionnaires/<int:questionnaire_id>/questions

Ajouter une question à un questionnaire

- GET /api/questionnaires/<int:questionnaire_id>/questions/<int:question_id>

Récupérer une question spécifique

- PUT /api/questionnaires/<int:questionnaire_id>/questions/<int:question_id>

Modifier une question

- DELETE /api/questionnaires/<int:questionnaire_id>/questions/<int:question_id>

Supprimer une question

### Client

Dans cette Single Page Application, il est possible de récupèrer les questionnaires dans une liste, d'en créer, d'en modifier et d'en supprimer.
Même chose pour les questions, il est possible de créer des questions de deux types différents, text et multiple.
J'ai fait en sorte d'optimiser l'application en limitant les requêtes envoyer à l'api en conservant des données qui ne sont pas modifiés et en conservant des éléments déjà construits.

## Présentation de l'organisation du code

Le code est réparti en deux répertoire:
- server
- client

Le serveur Flask contenant l'API se trouve dans le répertoire server.
Les commandes se trouvent dans commands.py. Les routes se trouvent dans views.py et le modèle englobant la base de données et les méthodes/fonctions utiles se trouve dans models.py. Les données sont stockés dans la base de données SQLite3 myapp.db.

La page client app.html se trouve dans le répertoire client. Le css, les images et le javascript sont répartis dans des sous-répertoires. Le code javascript est réparti en différents fichiers javascript encapsulant chacun une partie du code. 

Le fichier app.js contient un code chargeant les autres fichiers javascript. Le reste des fichiers js contient des classes de même noms. 

Utilitaires contient différents méthodes permettant de gérer les notifications et l'affichage dans la console. 

QuestionnaireListe est une extention de l'élément lu permettant de créer une liste de questionnaire. 

Questionnaire est une extention de li, une classe représentant à la fois un élément de QuestionnaireListe et contenant également les données d'un questionnaire. 

Question est la classe contenant les données de chaque questions. 

FormQuestionnaire est une classe extention de div, cette classe représente l'affichage d'un questionnaire une fois que l'on clique sur le nom de celui-ci dans la liste des questionnaires. 

FormQuestion est une extention de div, il est présent dans FormQuestionnaire pour chaque question du formulaire.