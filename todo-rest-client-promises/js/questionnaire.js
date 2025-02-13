function clearContent(element){
    while(element.firstChild){
        element.removeChild(element.firstChild);
    }
}

let button = document.getElementById('button');
button.addEventListener('click', function(){
    refreshQuestionnaireList();
});

function remplirQuestionnaires(json){
    let liste = document.createElement('ul');
    document.getElementById('questionnaires').append(liste);
    json.forEach(questionnaire => {
        let questionnaire_li = document.createElement('li');
        questionnaire_li.textContent = questionnaire.name;
        questionnaire_li.addEventListener('click', function(){
            getDetailQuestionnaire(questionnaire);
        });
        liste.append(questionnaire_li);
    });
}

function onerror(err, msg) {
    // A refaire, faire une notification d'erreur à la place
    if (msg){
        console.log(`${msg} - ${err}`);
    }
    else{
        console.log(err);
    }

    // let error = document.createElement('b');
    // error.textContent = 'Impossible de récupérer les questionnaires à réaliser !';
    // let questionnaires = document.getElementById('questionnaires');
    // questionnaires.appendChild(error);
    // questionnaires.appendChild(document.createTextNode(' ' + err));
}

function refreshQuestionnaireList(){
    clearContent(document.getElementById('questionnaires'));
    fetch('http://127.0.0.1:5000/api/questionnaires')
    .then(response => {
        if (response.ok) return response.json();
        else throw new Error('Problème ajax: ' + response.status);
    })
    .then(remplirQuestionnaires)
    .catch(err => onerror(err, 'Impossible de récupérer les questionnaires à réaliser !'));
}

function getDetailQuestionnaire(questionnaire) {
    fetch('http://127.0.0.1:5000' + questionnaire.uri)
    .then(response => {
        if (response.ok) return response.json();
        else throw new Error('Problème ajax: ' + response.status);
    })
    .then(jsonQuestions => {
            questionnaire.questions = jsonQuestions;
            details(questionnaire);
    })
    .catch(onerror);
}

function details(json){
    fillFormQuestionnaire(formQuestionnaire(), json);
}

function formQuestionnaire(isnew){
    let currentQuestionnaire = document.getElementById('currentQuestionnaire');
    clearContent(currentQuestionnaire);

    let titreQuestionnaire = document.createElement('h1');
    titreQuestionnaire.textContent = 'Titre';
    titreQuestionnaire.id = 'titreQuestionnaire';
    currentQuestionnaire.append(titreQuestionnaire);

    let titreQuestionnaireInput = document.createElement('input');
    titreQuestionnaireInput.type = 'text';
    titreQuestionnaireInput.id = 'titreQuestionnaireInput';
    titreQuestionnaire.append(titreQuestionnaireInput);
    
    let questionsQuestionnaire = document.createElement('ul');
    questionsQuestionnaire.id = 'listeQuestions';
    currentQuestionnaire.append(questionsQuestionnaire);

    let save = document.getElementById('saveQuestionnaire');
    if (!save){
        save = document.createElement('img');
        save.id = 'saveQuestionnaire';
        save.src = 'img/save.png';
        document.getElementById('tools').append(save);
    }

    if (isnew){
        // save envoie une requête POST pour enregistrer ce nouveau questionnaire
        save.alt = 'Enregistrer le questionnaire';
        save.onclick = function() {
            saveNewQuestionnaire(titreQuestionnaireInput.value);
        }
    }
    else{
        // save envoie une requête PUT pour enregistrer la modification du questionnaire
        save.alt = 'Sauvegarder le changement';
        save.onclick = function() {
            saveModifiedQuestionnaire(titreQuestionnaireInput.value);
        };
    }
    return currentQuestionnaire;
}

function formQuestion(form){
    // Création de l'élément li
    let liQuestion = document.createElement('li');
    liQuestion.style.border = '0.1em solid black';
    form.querySelector('#listeQuestions').append(liQuestion);

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
    saveQuestion.onclick = function(){
        // Refaire avec questionnaireForm et questionForm (form et liQuestion)
        saveNewQuestion(form, liQuestion);
    }
    boutons.append(saveQuestion);
    return liQuestion;
}

function fillFormQuestion(form, question){
    form.setAttribute('question_id', question.id);

    let titreQuestionInput = form.querySelector('#titreQuestion');
    titreQuestionInput.value = question.title;

    let typeQuestionInput = form.querySelector('#typeQuestion');
    typeQuestionInput.value = question.type;

    // Boutons de gestion de la question
    let boutons = form.querySelector('#boutonsQuestion');
    clearContent(boutons);

    let deleteQuestionButton = document.createElement('img');
    deleteQuestionButton.src = 'img/delete.png';
    deleteQuestionButton.onclick = function(){
        deleteQuestion(form);
    }
    boutons.append(deleteQuestionButton);

    let saveQuestion = document.createElement('img');
    saveQuestion.src = 'img/save.png';
    saveQuestion.onclick = function(){
        // A refaire
        saveModifiedQuestion(form, question);
        saveModifiedQuestion(question, titreQuestionInput.value, typeQuestionInput.value);
    }
    boutons.append(saveQuestion);
}

function fillFormQuestionnaire(form, questionnaire){
    form.querySelector('#titreQuestionnaire').setAttribute('questionnaireId', questionnaire.id);
    form.querySelector('#titreQuestionnaireInput').value = questionnaire.name;
    questionnaire.questions.forEach(question => {
        fillFormQuestion(formQuestion(form), question);
    });
    let newQuestion = document.createElement('img');
    document.getElementById('currentQuestionnaire').append(newQuestion);
    newQuestion.src = "img/new.png";
    newQuestion.onclick = function(){
        formQuestion(form);
    };
}

function saveModifiedQuestionnaire(title){
    let titreQuestionnaire = document.getElementById('titreQuestionnaire');
    if (title == ''){
        // Client error
        onerror('Il est impossible de modifier un questionnaire avec un titre vide');
    }
    else{
        // Création de la requête permettant de modifier le questionnaire
        fetch('http://localhost:5000/api/questionnaires',{
            headers: {'Content-Type': 'application/json'},
            method: 'PUT',
            body: JSON.stringify({"questionnaire_id":titreQuestionnaire.getAttribute('questionnaireId'),"name":title})
        })
        .then(response => {
            if (response.ok) {
                console.log('Update Success');
                refreshQuestionnaireList();
                return response.json()
            }
            else throw new Error('Problème ajax: ' + response.status);
        })
        .catch(onerror);
    }
}

document.querySelector('#tools #add').onclick = formQuestionnaire;

// curl -i -H "Content-Type: application/json" -X POST -d '{"name":"test"}' http://localhost:5000/api/questionnaires
function saveNewQuestionnaire(name){
    if (name == ''){
        // Client error
        onerror('Il est impossible de créer un questionnaire avec un titre vide');
    }
    else{
        // Création de la requête permettant de modifier le questionnaire
        fetch('http://localhost:5000/api/questionnaires',{
            headers: {'Content-Type': 'application/json'},
            method: 'POST',
            body: JSON.stringify({"name":name})
        })
        .then(response => {
            if (response.ok) {
                console.log('Insert Success');
                refreshQuestionnaireList();
                return response.json();
            }
            else throw new Error('Problème ajax: ' + response.status);
        })
        .then(json => {
            getDetailQuestionnaire(json);
        })
        .catch(onerror);
    }
}

function deleteQuestionnaire(){
    let titreQuestionnaire = document.getElementById('titreQuestionnaire');
    // Création de la requête permettant de modifier le questionnaire
    if (titreQuestionnaire){
        fetch('http://localhost:5000/api/questionnaires',{
            headers: {'Content-Type': 'application/json'},
            method: 'DELETE',
            body: JSON.stringify({"questionnaire_id":titreQuestionnaire.getAttribute("questionnaireId")})
        })
        .then(response => {
            if (response.ok) {
                console.log('Delete Success');
                refreshQuestionnaireList();
                return response.json();
            }
            else throw new Error('Problème ajax: ' + response.status);
        })
        .then(json => {
            console.log('Supression du questionnaire ' + json.name);
            clearContent(document.getElementById('currentQuestionnaire'));
        })
        .catch(onerror);
    }
}

document.querySelector('#tools #del').onclick = deleteQuestionnaire;

function deleteQuestion(form){
    fetch('http://localhost:5000/api/questions',{
        headers: {'Content-Type': 'application/json'},
        method: 'DELETE',
        body: JSON.stringify({"question_id":form.getAttribute('question_id')})
    })
    .then(response => {
        if (response.ok) {
            console.log('Delete Success');
            refreshQuestionnaireList();
            return response.json();
        }
        else throw new Error('Problème ajax: ' + response.status);
    })
    .then(json => {
        console.log('Supression de la question ' + json.title);
        form.remove();
    })
    .catch(onerror);
}

function saveModifiedQuestion(form, question){
    title = form.querySelector('#titreQuestion').value;
    type = form.querySelector('#typeQuestion').value;
    let bodyRequest = {'question_id':question.id};
    if (question.title != title){
        if (title != ''){
            bodyRequest.title = title;
        }
        else{
            // Client error
            onerror("Il n'est pas possible d'avoir un titre vide");
        }
    }
    if (question.type != type){
        if (type != ''){
            bodyRequest.type = type;
        }
        else{
            // Client error
            onerror("Il n'est pas possible d'avoir un type vide")
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
            if (response.ok) {
                console.log('Update Success');
            }
            else throw new Error('Problème ajax: ' + response.status);
        })
        .then(json => {
            fillFormQuestion(form, json)
        })
        .catch(onerror);
    }
    else{
        // Client error
        onerror("Aucun changement de fait");
    }
}

// curl -i -H "Content-Type: application/json" -X POST -d '{"title":"testQ", "type":"text", "questionnaire_id":1}' http://localhost:5000/api/questions
function saveNewQuestion(questionnaire, question){
    title = question.querySelector('#titreQuestion').value;
    type = question.querySelector('#typeQuestion').value;
    let questionnaire_id = questionnaire.querySelector('#titreQuestionnaire').getAttribute('questionnaireId');
    const errors = [];

    if (!title) errors.push("Il est impossible de créer une question avec un titre vide");
    if (!type) errors.push("Il est impossible de créer une question avec un type vide");
    
    if (errors.length) {
        // Client error
        errors.forEach(error => onerror(error));
    }
    else {
        // Création de la requête permettant de modifier le questionnaire
        fetch('http://localhost:5000/api/questions',{
        headers: {'Content-Type': 'application/json'},
        method: 'POST',
        body: JSON.stringify({"title":title, "type":type, "questionnaire_id":questionnaire_id})
        })
        .then(response => {
            if (response.ok) {
                console.log('Insert Success');
                refreshQuestionnaireList();
                return response.json();
            }
            else throw new Error('Problème ajax: ' + response.status);
        })
        .then(json => {
            fillFormQuestion(question, json)
        })
        .catch(onerror);
    }
}