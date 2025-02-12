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

function onerror(err) {
    // A refaire, faire une notification d'erreur à la place

    console.log('Impossible de récupérer les questionnaires à réaliser ! ' + err);

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
    .catch(onerror);
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
    .catch(res => console.log(res));
}

function details(json){
    formQuestionnaire();
    fillFromQuestionnaire(json);
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
            saveNewQuestionnaire();
        }
    }
    else{
        // save envoie une requête PUT pour enregistrer la modification du questionnaire
        save.alt = 'Sauvegarder le changement';
        save.onclick = function() {
            saveModifiedQuestionnaire();
        };
    }
}

function fillFromQuestionnaire(json){
    document.getElementById('titreQuestionnaire').setAttribute('questionnaireId', json.id);
    document.getElementById('titreQuestionnaireInput').value = json.name;
    let questionsQuestionnaire = document.getElementById('listeQuestions');
    json.questions.forEach(question => {
        // Création de l'élément li
        let liQuestion = document.createElement('li');
        liQuestion.id = 'question'+question.id;
        liQuestion.style.border = '0.1em solid black';
        questionsQuestionnaire.append(liQuestion);

        // Création de l'élément du titre de la question
        let titre = document.createElement('div');
        liQuestion.append(titre);

        let titreQuestion = document.createElement('label');
        titreQuestion.setAttribute('for', 'titreQuestion'+question.id);
        titreQuestion.textContent = 'Titre : '
        titre.append(titreQuestion);

        let titreQuestionInput = document.createElement('input');
        titreQuestionInput.id = 'titreQuestion'+question.id;
        titreQuestionInput.value = question.title;
        titre.append(titreQuestionInput);

        // Création de l'élément du type de la question
        let type = document.createElement('div');
        liQuestion.append(type);

        let typeQuestion = document.createElement('label');
        typeQuestion.setAttribute('for', 'typeQuestion'+question.id);
        typeQuestion.textContent = 'Type : '
        type.append(typeQuestion);

        let typeQuestionInput = document.createElement('input');
        typeQuestionInput.id = 'typeQuestion'+question.id;
        typeQuestionInput.value = question.type;
        type.append(typeQuestionInput);

        // Boutons de gestion de la question
        let boutons = document.createElement('div');
        liQuestion.append(boutons);

        let deleteQuestionButton = document.createElement('img');
        deleteQuestionButton.src = 'img/delete.png';
        deleteQuestionButton.onclick = function(){
            deleteQuestion(question);
        }
        boutons.append(deleteQuestionButton);

        let saveQuestion = document.createElement('img');
        saveQuestion.src = 'img/save.png';
        boutons.append(saveQuestion);
    });
}

function saveModifiedQuestionnaire(){
    let titreQuestionnaireInput = document.getElementById('titreQuestionnaireInput');
    let titreQuestionnaire = document.getElementById('titreQuestionnaire');
    // Création de la requête permettant de modifier le questionnaire
    fetch('http://localhost:5000/api/questionnaires',{
        headers: {'Content-Type': 'application/json'},
        method: 'PUT',
        body: `{'questionnaire_id':${titreQuestionnaire.getAttribute('questionnaireId')},'name':'${titreQuestionnaireInput.value}'}`
    })
    .then(response => {
        if (response.ok) {
            console.log('Update Success');
            refreshQuestionnaireList();
            return response.json();
        }
        else throw new Error('Problème ajax: ' + response.status);
    })
    .then(json => titreQuestionnaireInput.value = json.name)
    .catch(res => console.log(res));
}

document.querySelector('#tools #add').onclick = formQuestionnaire;

function saveNewQuestionnaire(){
    let titreQuestionnaireInput = document.getElementById('titreQuestionnaireInput');
    // Création de la requête permettant de modifier le questionnaire
    fetch('http://localhost:5000/api/questionnaires',{
        headers: {'Content-Type': 'application/json'},
        method: 'POST',
        body: `{'name':'${titreQuestionnaireInput.value}'}`
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
        document.getElementById('titreQuestionnaire').setAttribute('questionnaireId', json.id);
        titreQuestionnaireInput.value = json.name;
        document.getElementById('saveQuestionnaire').onclick = saveModifiedQuestionnaire();
    })
    .catch(res => console.log(res));
}

function deleteQuestionnaire(){
    let titreQuestionnaire = document.getElementById('titreQuestionnaire');
    // Création de la requête permettant de modifier le questionnaire
    if (titreQuestionnaire){
        fetch('http://localhost:5000/api/questionnaires',{
            headers: {'Content-Type': 'application/json'},
            method: 'DELETE',
            body: `{'questionnaire_id':${titreQuestionnaire.getAttribute('questionnaireId')}}`
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
        .catch(res => console.log(res));
    }
}

document.querySelector('#tools #del').onclick = deleteQuestionnaire;

function deleteQuestion(json){
    console.log(json, json.id);
    fetch('http://localhost:5000/api/questions',{
        headers: {'Content-Type': 'application/json'},
        method: 'DELETE',
        body: `{'question_id':'${json.id}'}`
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
        document.getElementById('question'+json.id).remove();
    })
    .catch(res => console.log(res));
}
