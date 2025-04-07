# TD 1 - Architecture logicielle

Réalisé par Baptiste Mignan

## Installation

    make install

Si vous voulez charger des données

    make loaddb

## Lancement
Pour le serveur de l'API

    make run

Pour le client VueJS

    make runvue

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

### Client VueJS

Dans cette application VueJS, il est possible de récupèrer les questionnaires dans une liste, d'en créer, d'en modifier et d'en supprimer.
Même chose pour les questions, il est possible de créer des questions de deux types différents, text et multiple.

## Présentation de l'organisation du code

Le code est réparti en deux répertoire:
- server
- client VueJS

Le serveur Flask contenant l'API se trouve dans le répertoire server.
Les commandes se trouvent dans commands.py. Les routes se trouvent dans views.py et le modèle englobant la base de données et les méthodes/fonctions utiles se trouve dans models.py. Les données sont stockés dans la base de données SQLite3 myapp.db.


Notre application est composé de 2 composants VueJS. Questionnaire pour chaque questionnaire de l'application dans la partie de gauche et EditeurQUestionnaire qui comme son nom l'indique, gère la partie editeur questionnaire.