class Utilitaire{
    static clearContent(element){
        while(element.firstChild){
            element.removeChild(element.firstChild);
        }
    }

    static showNotification(message, color, bold) {
        let container = document.getElementById("notification-container");
        if (!container) {
            container = document.createElement("div");
            container.id = "notification-container";
            container.style.position = "fixed";
            container.style.top = "25px";
            container.style.left = "25px";
            container.style.zIndex = "1000";
            container.style.display = "flex";
            container.style.flexDirection = "column-reverse";
            container.style.gap = "5px";
            document.body.appendChild(container);
        }
    
        const notification = document.createElement("div");
        notification.textContent = message;
        if (color){
            notification.style.background = color;
        }
        else{
            notification.style.background = "#333";
        }
        if (bold){
            notification.style.fontWeight = "bold";
        }
        notification.style.color = "white";
        notification.style.padding = "10px";
        notification.style.borderRadius = "15px";
        notification.style.opacity = "0";
        notification.style.transition = "opacity 0.3s, transform 0.3s";
        notification.style.transform = "translateY(-10px)";
        notification.style.minWidth = "10em";
    
        container.appendChild(notification);
    
        for (let i = -10; i < 0; i += 2){
            setTimeout(() => {
                notification.style.transform = `translateY(${i})`;
            }, 2);
        }
        setTimeout(() => {
            notification.style.opacity = "1";
        }, 10);
    
        setTimeout(() => {
            notification.style.opacity = "0";
            notification.style.transform = "translateY(-10px)";
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    static showMessage(err, msg, color, bold){
        if (msg != ''){
            Utilitaire.showNotification(msg, color, bold);
        }
        if (err != ''){
            let css = '';
            if (color){
                css += `color:${color};`;
            }
            if (bold){
                css += 'font-weight: bold;';
            }
            if (css.length){
                console.log(`%c ${err}`, css);
            }
            else{
                console.log(err);
            }
        }
    }
    
    static errorServeur(err, msg){
        if (err && !msg){
            Utilitaire.showMessage(err, '', 'red', true);
        }
        if (!err && msg){
            Utilitaire.showMessage('', msg, 'red', true);
        }
        if (err && msg){
            Utilitaire.showMessage(err, msg, 'red', true);
        }
    }

    static errorClient(msg){
        Utilitaire.showMessage(msg, msg, 'orange', true);
    }

    static successMessage(msg){
        Utilitaire.showMessage(msg, msg, 'green', true);
    }
}


class QuestionnaireListe extends HTMLUListElement {
    constructor() {
        if (QuestionnaireListe.instance) {
            return QuestionnaireListe.instance;
        }
        super();
        QuestionnaireListe.instance = this;
        return this;
    }

    static getQuestionnaireListe() {
        if (!QuestionnaireListe.instance) {
            QuestionnaireListe.instance = new QuestionnaireListe();
            document.getElementById('questionnaires').appendChild(QuestionnaireListe.instance);
        }
        return QuestionnaireListe.instance;
    }

    remplirQuestionnaires(questionnaires){questionnaires.forEach(questionnaireData => this.appendChild(new Questionnaire(questionnaireData)))}

    refreshQuestionnaireList(){
        Utilitaire.clearContent(this);
        fetch('http://127.0.0.1:5000/api/questionnaires')
        .then(response => {
            if (response.ok) return response.json();
            else throw new Error('Problème ajax: ' + response.status);
        })
        .then(questionnaires => this.remplirQuestionnaires(questionnaires))
        .catch(err => Utilitaire.errorServeur(err, 'Impossible de récupérer les questionnaires à réaliser !'));
    }

    getQuestionnaire(questionnaireId){
        // Ne fonctionne pas, à retravailler
        let questionnaires = this.childNodes.values();
        console.log(questionnaires);
        for (let questionnaire of questionnaires){
            console.log(questionnaire);
        }
    }
}
customElements.define("questionnaire-liste", QuestionnaireListe, { extends: "ul" });

class Questionnaire extends HTMLLIElement {
    // Les datas du questionnaire
    constructor(data){
        super();
        this.id = data.id;
        this.name = data.name;
        this.uri = data.uri;
        this.textContent = this.name;
        this.onclick = this.details;
    }

    async getQuestions(){
        await fetch('http://127.0.0.1:5000' + this.uri)
        .then(response => {
            if (response.ok) return response.json();
            else throw new Error('Problème ajax: ' + response.status);
        })
        .then(dataQuestions => {
            // A changer pour obtenir les objets questions
            this.questions = []
            dataQuestions.forEach(dataQuestion => this.questions.push(new Question(dataQuestion)));
        })
        .catch(Utilitaire.errorServeur);
    }

    async details(){
        if (!this.questions){
            await this.getQuestions();
        }
        new FormQuestionnaire().fillFormQuestionnaire(this);
    }
}
customElements.define("questionnaire-li", Questionnaire, { extends: "li" });

class FormQuestionnaire extends HTMLDivElement {
    // Le formulaire du questionnaire
    constructor(isnew){
        super();
        let currentQuestionnaire = document.getElementById('currentQuestionnaire');
        Utilitaire.clearContent(currentQuestionnaire);
        currentQuestionnaire.append(this);

        let titreQuestionnaire = document.createElement('h1');
        titreQuestionnaire.textContent = 'Titre';
        titreQuestionnaire.id = 'titreQuestionnaire';
        this.append(titreQuestionnaire);

        let titreQuestionnaireInput = document.createElement('input');
        titreQuestionnaireInput.type = 'text';
        titreQuestionnaireInput.id = 'titreQuestionnaireInput';
        titreQuestionnaire.append(titreQuestionnaireInput);
        
        let questionsQuestionnaire = document.createElement('ul');
        questionsQuestionnaire.id = 'listeQuestions';
        this.append(questionsQuestionnaire);

        let tools = document.getElementById('tools');

        let del = tools.querySelector('#del');
        if (!del){
            if (!isnew){
                del = document.createElement('img');
                del.id = 'del';
                del.src = 'img/delete.png';
                del.onclick = () => this.deleteQuestionnaire();
                tools.append(del);
            }
        }
        else{
            if (isnew){
                del.remove();
            }
            else{
                del.onclick = () => this.deleteQuestionnaire();
            }
        }

        let save = tools.querySelector('#save');
        if (!save){
            save = document.createElement('img');
            save.id = 'save';
            save.src = 'img/save.png';
            tools.append(save);
        }

        if (isnew){
            save.alt = 'Enregistrer le questionnaire';
            save.onclick = () => this.saveNewQuestionnaire();
        }
        else{
            save.alt = 'Sauvegarder le changement';
            save.onclick = () => this.saveModifiedQuestionnaire();
        }
    }

    fillFormQuestionnaire(questionnaire){
        // modifier l'emplacement de l'id ou du questionnaire
        this.querySelector('#titreQuestionnaire').setAttribute('questionnaireId', questionnaire.id);
        this.querySelector('#titreQuestionnaireInput').value = questionnaire.name;
        questionnaire.questions.forEach(question => {
            new FormQuestion(this).fillFormQuestion(question);
        });
        let newQuestion = document.createElement('img');
        this.append(newQuestion);
        newQuestion.src = "img/new.png";
        newQuestion.onclick = () => new FormQuestion(this);
    }

    saveNewQuestionnaire(){
        let name = this.querySelector('#titreQuestionnaireInput').value;
        if (name == ''){
            Utilitaire.errorClient('Il est impossible de créer un questionnaire avec un titre vide');
        }
        else{
            // Création de la requête permettant de modifier le questionnaire
            fetch('http://localhost:5000/api/questionnaires',{
                headers: {'Content-Type': 'application/json'},
                method: 'POST',
                body: JSON.stringify({"name":name})
            })
            .then(response => {
                if (response.ok){
                    Utilitaire.successMessage('Insert Success');
                    QuestionnaireListe.getQuestionnaireListe().refreshQuestionnaireList();
                    return response.json();
                }
                else throw new Error('Problème ajax: ' + response.status);
            })
            .then(dataQuestionnaire => {
                QuestionnaireListe.getQuestionnaireListe().getQuestionnaire(dataQuestionnaire.id) // .details();
                // Nécessite d'afficher le questionnaire nouvellement créer
                document.getElementById('save').remove();
            })
            .catch(Utilitaire.errorServeur);
        }
    }

    saveModifiedQuestionnaire(){
        let name = this.querySelector('#titreQuestionnaireInput').value
        if (name == ''){
            Utilitaire.errorClient('Il est impossible de modifier un questionnaire avec un titre vide');
        }
        else{
            // Création de la requête permettant de modifier le questionnaire
            fetch('http://localhost:5000/api/questionnaires',{
                headers: {'Content-Type': 'application/json'},
                method: 'PUT',
                body: JSON.stringify({"questionnaire_id":this.querySelector('#titreQuestionnaire').getAttribute('questionnaireId'),"name":name})
            })
            .then(response => {
                if (response.ok){
                    Utilitaire.successMessage('Update Success');
                    QuestionnaireListe.getQuestionnaireListe().refreshQuestionnaireList();
                }
                else throw new Error('Problème ajax: ' + response.status);
            })
            .catch(Utilitaire.errorServeur);
        }
    }

    deleteQuestionnaire(){
        // Création de la requête permettant de modifier le questionnaire
        fetch('http://localhost:5000/api/questionnaires',{
            headers: {'Content-Type': 'application/json'},
            method: 'DELETE',
            body: JSON.stringify({"questionnaire_id":this.querySelector('#titreQuestionnaire').getAttribute('questionnaireId')})
        })
        .then(response => {
            if (response.ok){
                Utilitaire.successMessage('Delete Success');
                QuestionnaireListe.getQuestionnaireListe().refreshQuestionnaireList();
                return response.json();
            }
            else throw new Error('Problème ajax: ' + response.status);
        })
        .then(dataQuestionnaire => {
            Utilitaire.successMessage('Supression du questionnaire ' + dataQuestionnaire.name);
            this.remove();
            document.getElementById('del').remove();
            document.getElementById('save').remove();
        })
        .catch(Utilitaire.errorServeur);
    }
}
customElements.define("form-questionnaire", FormQuestionnaire, { extends: "div" });

class Question{
    // Les datas de la question
    constructor(data){
        this.id = data.id;
        this.title = data.title;
        this.type = data.type;
    }
}

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


document.getElementById('button').onclick = () => QuestionnaireListe.getQuestionnaireListe().refreshQuestionnaireList();

document.querySelector('#tools #add').onclick = () => new FormQuestionnaire(true);
