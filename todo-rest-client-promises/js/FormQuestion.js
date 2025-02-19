class FormQuestion extends HTMLLIElement {
    // Le formulaire de la question
    // Corriger la construction des fonctions pour les adapter à la nouvelle structure
    constructor(formQuestionnaire){
        super();

        // Création de l'élément li
        this.style.border = '0.1em solid black';
        formQuestionnaire.querySelector('#listeQuestions').append(this);

        // Création de l'élément du titre de la question
        let titre = document.createElement('div');
        this.append(titre);

        let titreQuestion = document.createElement('label');
        titreQuestion.setAttribute('for', 'titreQuestion');
        titreQuestion.setAttribute('id', 'titreQuestionLabel');
        titreQuestion.textContent = 'Titre : '
        titre.append(titreQuestion);

        let titreQuestionInput = document.createElement('input');
        titreQuestionInput.id = 'titreQuestion';
        titre.append(titreQuestionInput);

        // Création de l'élément du type de la question
        let type = document.createElement('div');
        this.append(type);

        let typeQuestion = document.createElement('label');
        typeQuestion.setAttribute('for', 'typeQuestion');
        typeQuestion.setAttribute('id', 'typeQuestionLabel');
        typeQuestion.textContent = 'Type : ';
        type.append(typeQuestion);

        let typeQuestionInput = document.createElement('input');
        typeQuestionInput.id = 'typeQuestion';
        type.append(typeQuestionInput);

        // Boutons de gestion de la question
        let boutons = document.createElement('div');
        boutons.id = 'boutonsQuestion';
        this.append(boutons);

        let saveQuestion = document.createElement('img');
        saveQuestion.src = 'img/save.png';
        saveQuestion.onclick = () => this.saveNewQuestion(formQuestionnaire);
        boutons.append(saveQuestion);
    }

    fillFormQuestion(question){
        this.setAttribute('QuestionId', question.id);
    
        let titreQuestionInput = this.querySelector('#titreQuestion');
        titreQuestionInput.value = question.title;
    
        let typeQuestionInput = this.querySelector('#typeQuestion');
        typeQuestionInput.value = question.type;
    
        // Boutons de gestion de la question
        let boutons = this.querySelector('#boutonsQuestion');
        Utilitaire.clearContent(boutons);
    
        let deleteQuestionButton = document.createElement('img');
        deleteQuestionButton.src = 'img/delete.png';
        deleteQuestionButton.onclick = () => this.deleteQuestion();
        boutons.append(deleteQuestionButton);
    
        let saveQuestion = document.createElement('img');
        saveQuestion.src = 'img/save.png';
        saveQuestion.onclick = () => this.saveModifiedQuestion(question);
        boutons.append(saveQuestion);
    }

    saveNewQuestion(formQuestionnaire){
        let title = this.querySelector('#titreQuestion').value; // Récupère la valeur du title de la question
        let type = this.querySelector('#typeQuestion').value; // Récupère la valeur du type de la question
        let questionnaireId = formQuestionnaire.querySelector('#titreQuestionnaire').getAttribute('questionnaireId');
    
        const errors = [];
        if (!title) errors.push("Il est impossible de créer une question avec un title vide");
        if (!type) errors.push("Il est impossible de créer une question avec un type vide");
        if (errors.length){
            errors.forEach(error => Utilitaire.errorClient(error));
        }
        else {
            // Création de la requête permettant de modifier le questionnaire
            fetch('http://localhost:5000/api/questions',{
            headers: {'Content-Type': 'application/json'},
            method: 'POST',
            body: JSON.stringify({"title":title, "type":type, "questionnaire_id":questionnaireId})
            })
            .then(response => {
                if (response.ok){
                    Utilitaire.successMessage('Insert Success');
                    // Nécessaire de refresh ? Mérite réflexion
                    QuestionnaireListe.getQuestionnaireListe().refreshQuestionnaireList();
                    return response.json();
                }
                else throw new Error('Problème ajax: ' + response.status);
            })
            .then(dataQuestion => {
                // Remplacer par une question
                // Gérer la liste des questions du questionnaire côté client, la mettre à jour en remplaçant la question
                this.fillFormQuestion(dataQuestion)
            })
            .catch(Utilitaire.errorServeur);
        }
    }
    
    saveModifiedQuestion(question){
        let title = this.querySelector('#titreQuestion').value;
        let type = this.querySelector('#typeQuestion').value;
        let bodyRequest = {'question_id':question.id};
        if (question.title != title){
            if (title != ''){
                bodyRequest.title = title;
            }
            else{
                // Client error
                Utilitaire.errorClient("Il n'est pas possible d'avoir un titre vide");
            }
        }
        if (question.type != type){
            if (type != ''){
                bodyRequest.type = type;
            }
            else{
                // Client error
                Utilitaire.errorClient("Il n'est pas possible d'avoir un type vide")
            }
        }
        if (Object.keys(bodyRequest).length > 1){
            // Création de la requête permettant de modifier la question
            fetch('http://localhost:5000/api/questions',{
                headers: {'Content-Type': 'application/json'},
                method: 'PUT',
                body: JSON.stringify(bodyRequest)
            })
            .then(response => {
                if (response.ok){
                    Utilitaire.successMessage('Update Success');
                    return response.json();
                }
                else throw new Error('Problème ajax: ' + response.status);
            })
            .then(dataQuestion => {
                // Remplacer par une question
                // Gérer la liste des questions du questionnaire côté client, la mettre à jour en remplaçant la question
                this.fillFormQuestion(dataQuestion)
            })
            .catch(Utilitaire.errorServeur);
        }
        else{
            Utilitaire.errorClient("Aucun changement de fait");
        }
    }
    
    deleteQuestion(){
        fetch('http://localhost:5000/api/questions',{
            headers: {'Content-Type': 'application/json'},
            method: 'DELETE',
            body: JSON.stringify({"question_id":this.getAttribute('questionId')})
        })
        .then(response => {
            if (response.ok){
                // Nécessaire ? On ne supprime qu'une question après tout. Juste reload les questions du questionnaire après la suppression
                QuestionnaireListe.getQuestionnaireListe().refreshQuestionnaireList();
                Utilitaire.successMessage('Delete Success');
                return response.json();
            }
            else throw new Error('Problème ajax: ' + response.status);
        })
        .then(dataQuestion => {
            Utilitaire.successMessage('Supression de la question ' + dataQuestion.title);
            this.remove();
        })
        .catch(Utilitaire.errorServeur);
    }
}
customElements.define("form-question", FormQuestion, { extends: "li" });
