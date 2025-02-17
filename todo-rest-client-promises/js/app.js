function clearContent(element){
    while(element.firstChild){
        element.removeChild(element.firstChild);
    }
}


function showNotification(message, color, bold) {
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

    for (i = -10; i < 0; i += 2){
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

function showMessage(err, msg, color, bold){
    if (msg != ''){
        showNotification(msg, color, bold);
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

function errorServeur(err, msg){
    if (err && !msg){
        showMessage(err=err, msg='', color='red', bold=true);
    }
    if (!err && msg){
        showMessage(err='', msg=msg, color='red', bold=true);
    }
    if (err && msg){
        showMessage(err=err, msg=msg, color='red', bold=true);
    }
}

function errorClient(msg){
    showMessage(err=msg, msg=msg, color='orange', bold=true);
}

function successMessage(msg){
    showMessage(err=msg, msg=msg, color='green', bold=true);
}

document.getElementById('button').onclick = refreshQuestionnaireList;

document.querySelector('#tools #add').onclick = formQuestionnaire;

function remplirQuestionnaires(questionnaires){
    let liste = document.createElement('ul');
    document.getElementById('questionnaires').append(liste);
    questionnaires.forEach(questionnaire => {
        let liQuestionnaire = document.createElement('li');
        liQuestionnaire.textContent = questionnaire.name;
        liQuestionnaire.addEventListener('click', () => getDetailQuestionnaire(questionnaire));
        liste.append(liQuestionnaire);
    });
}

function refreshQuestionnaireList(){
    clearContent(document.getElementById('questionnaires'));
    fetch('http://127.0.0.1:5000/api/questionnaires')
    .then(response => {
        if (response.ok) return response.json();
        else throw new Error('Problème ajax: ' + response.status);
    })
    .then(remplirQuestionnaires)
    .catch(err => errorServeur(err, 'Impossible de récupérer les questionnaires à réaliser !'));
}





function formQuestion(formQuestionnaire){
    // Création de l'élément li
    let liQuestion = document.createElement('li');
    liQuestion.style.border = '0.1em solid black';
    formQuestionnaire.querySelector('#listeQuestions').append(liQuestion);

    // Création de l'élément du titre de la question
    let titre = document.createElement('div');
    liQuestion.append(titre);

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
    liQuestion.append(type);

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
    liQuestion.append(boutons);

    let saveQuestion = document.createElement('img');
    saveQuestion.src = 'img/save.png';
    saveQuestion.onclick = () => saveNewQuestion(formQuestionnaire, liQuestion);
    boutons.append(saveQuestion);
    return liQuestion;
}

function fillFormQuestion(formQuestion, dataQuestion){
    formQuestion.setAttribute('QuestionId', dataQuestion.id);

    let titreQuestionInput = formQuestion.querySelector('#titreQuestion');
    titreQuestionInput.value = dataQuestion.title;

    let typeQuestionInput = formQuestion.querySelector('#typeQuestion');
    typeQuestionInput.value = dataQuestion.type;

    // Boutons de gestion de la question
    let boutons = formQuestion.querySelector('#boutonsQuestion');
    clearContent(boutons);

    let deleteQuestionButton = document.createElement('img');
    deleteQuestionButton.src = 'img/delete.png';
    deleteQuestionButton.onclick = () => deleteQuestion(formQuestion);
    boutons.append(deleteQuestionButton);

    let saveQuestion = document.createElement('img');
    saveQuestion.src = 'img/save.png';
    saveQuestion.onclick = () => saveModifiedQuestion(formQuestion, dataQuestion);
    boutons.append(saveQuestion);
}

function saveNewQuestion(formQuestionnaire, formQuestion){
    let title = formQuestion.querySelector('#titreQuestion').value; // Récupère la valeur du title de la question
    let type = formQuestion.querySelector('#typeQuestion').value; // Récupère la valeur du type de la question
    let questionnaireId = formQuestionnaire.querySelector('#titreQuestionnaire').getAttribute('questionnaireId');

    const errors = [];
    if (!title) errors.push("Il est impossible de créer une question avec un title vide");
    if (!type) errors.push("Il est impossible de créer une question avec un type vide");
    if (errors.length){
        errors.forEach(error => errorClient(error));
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
                successMessage('Insert Success');
                refreshQuestionnaireList();
                return response.json();
            }
            else throw new Error('Problème ajax: ' + response.status);
        })
        .then(dataQuestion => {
            fillFormQuestion(formQuestion, dataQuestion)
        })
        .catch(errorServeur);
    }
}

function saveModifiedQuestion(formQuestion, dataQuestion){
    let title = formQuestion.querySelector('#titreQuestion').value;
    let type = formQuestion.querySelector('#typeQuestion').value;
    let bodyRequest = {'question_id':dataQuestion.id};
    if (dataQuestion.title != title){
        if (title != ''){
            bodyRequest.title = title;
        }
        else{
            // Client error
            errorClient("Il n'est pas possible d'avoir un titre vide");
        }
    }
    if (dataQuestion.type != type){
        if (type != ''){
            bodyRequest.type = type;
        }
        else{
            // Client error
            errorClient("Il n'est pas possible d'avoir un type vide")
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
                successMessage('Update Success');
                return response.json();
            }
            else throw new Error('Problème ajax: ' + response.status);
        })
        .then(dataQuestion => {
            fillFormQuestion(formQuestion, dataQuestion)
        })
        .catch(errorServeur);
    }
    else{
        errorClient("Aucun changement de fait");
    }
}

function deleteQuestion(formQuestion){
    fetch('http://localhost:5000/api/questions',{
        headers: {'Content-Type': 'application/json'},
        method: 'DELETE',
        body: JSON.stringify({"question_id":formQuestion.getAttribute('questionId')})
    })
    .then(response => {
        if (response.ok){
            successMessage('Delete Success');
            refreshQuestionnaireList();
            return response.json();
        }
        else throw new Error('Problème ajax: ' + response.status);
    })
    .then(dataQuestion => {
        successMessage('Supression de la question ' + dataQuestion.title);
        formQuestion.remove();
    })
    .catch(errorServeur);
}

class Questionnaire{
    // Les datas du questionnaire
    constructor(data){
        this.id = data.id;
        this.name = data.name;
        this.uri = data.uri;
    }

    #getQuestions(){
        fetch('http://127.0.0.1:5000' + this.uri)
        .then(response => {
            if (response.ok) return response.json();
            else throw new Error('Problème ajax: ' + response.status);
        })
        .then(dataQuestions => {
            // A changer pour obtenir les objets questions
            this.questions = dataQuestions;
        })
        .catch(errorServeur);
    }

    details(){
        if (!this.questions){
            this.#getQuestions();
        }
        FormQuestionnaire().fillFormQuestionnaire(this);
    }
}

class FormQuestionnaire extends HTMLDivElement {
    // Le formulaire du questionnaire
    constructor(isnew){
        super();
        let currentQuestionnaire = document.getElementById('currentQuestionnaire');
        clearContent(currentQuestionnaire);
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
        this.querySelector('#titreQuestionnaire').setAttribute('questionnaireId', questionnaire.id);
        this.querySelector('#titreQuestionnaireInput').value = questionnaire.name;
        questionnaire.questions.forEach(question => {
            FormQuestion(this).fillFormQuestion(question);
        });
        let newQuestion = document.createElement('img');
        this.append(newQuestion);
        newQuestion.src = "img/new.png";
        newQuestion.onclick = () => formQuestion(this);
    }

    saveNewQuestionnaire(){
        let name = this.querySelector('#titreQuestionnaireInput').value
        if (name == ''){
            errorClient('Il est impossible de créer un questionnaire avec un titre vide');
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
                    successMessage('Insert Success');
                    refreshQuestionnaireList();
                    return response.json();
                }
                else throw new Error('Problème ajax: ' + response.status);
            })
            .then(dataQuestionnaire => {
                getDetailQuestionnaire(dataQuestionnaire);
                document.getElementById('save').remove();
            })
            .catch(errorServeur);
        }
    }

    saveModifiedQuestionnaire(){
        let name = this.querySelector('#titreQuestionnaireInput').value
        if (name == ''){
            errorClient('Il est impossible de modifier un questionnaire avec un titre vide');
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
                    successMessage('Update Success');
                    refreshQuestionnaireList();
                }
                else throw new Error('Problème ajax: ' + response.status);
            })
            .catch(errorServeur);
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
                successMessage('Delete Success');
                refreshQuestionnaireList();
                return response.json();
            }
            else throw new Error('Problème ajax: ' + response.status);
        })
        .then(dataQuestionnaire => {
            successMessage('Supression du questionnaire ' + dataQuestionnaire.name);
            this.remove();
            document.getElementById('del').remove();
            document.getElementById('save').remove();
        })
        .catch(errorServeur);
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
        saveQuestion.onclick = () => saveNewQuestion(formQuestionnaire, this);
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
        clearContent(boutons);
    
        let deleteQuestionButton = document.createElement('img');
        deleteQuestionButton.src = 'img/delete.png';
        deleteQuestionButton.onclick = () => deleteQuestion(this);
        boutons.append(deleteQuestionButton);
    
        let saveQuestion = document.createElement('img');
        saveQuestion.src = 'img/save.png';
        saveQuestion.onclick = () => saveModifiedQuestion(this, question);
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
            errors.forEach(error => errorClient(error));
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
                    successMessage('Insert Success');
                    refreshQuestionnaireList();
                    return response.json();
                }
                else throw new Error('Problème ajax: ' + response.status);
            })
            .then(dataQuestion => {
                // Remplacer par une question
                // Gérer la liste des questions du questionnaire côté client, la mettre à jour en remplaçant la question
                this.fillFormQuestion(dataQuestion)
            })
            .catch(errorServeur);
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
                errorClient("Il n'est pas possible d'avoir un titre vide");
            }
        }
        if (question.type != type){
            if (type != ''){
                bodyRequest.type = type;
            }
            else{
                // Client error
                errorClient("Il n'est pas possible d'avoir un type vide")
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
                    successMessage('Update Success');
                    return response.json();
                }
                else throw new Error('Problème ajax: ' + response.status);
            })
            .then(dataQuestion => {
                // Remplacer par une question
                // Gérer la liste des questions du questionnaire côté client, la mettre à jour en remplaçant la question
                this.fillFormQuestion(dataQuestion)
            })
            .catch(errorServeur);
        }
        else{
            errorClient("Aucun changement de fait");
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
                refreshQuestionnaireList();
                successMessage('Delete Success');
                return response.json();
            }
            else throw new Error('Problème ajax: ' + response.status);
        })
        .then(dataQuestion => {
            successMessage('Supression de la question ' + dataQuestion.title);
            this.remove();
        })
        .catch(errorServeur);
    }
}
customElements.define("form-question", FormQuestion, { extends: "li" });
