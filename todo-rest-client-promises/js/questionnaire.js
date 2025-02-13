function clearContent(element){
    while(element.firstChild){
        element.removeChild(element.firstChild);
    }
}

document.getElementById('button').onclick = refreshQuestionnaireList;

document.querySelector('#tools #add').onclick = formQuestionnaire;

document.querySelector('#tools #del').onclick = deleteQuestionnaire;

function remplirQuestionnaires(questionnaires){
    let liste = document.createElement('ul');
    document.getElementById('questionnaires').append(liste);
    questionnaires.forEach(questionnaire => {
        let liQuestionnaire = document.createElement('li');
        liQuestionnaire.textContent = questionnaire.name;
        liQuestionnaire.addEventListener('click', function(){
            getDetailQuestionnaire(questionnaire);
        });
        liste.append(liQuestionnaire);
    });
}

function onerror(err, msg){
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

function getDetailQuestionnaire(questionnaire){
    fetch('http://127.0.0.1:5000' + questionnaire.uri)
    .then(response => {
        if (response.ok) return response.json();
        else throw new Error('Problème ajax: ' + response.status);
    })
    .then(dataQuestions => {
            questionnaire.questions = dataQuestions;
            details(questionnaire);
    })
    .catch(onerror);
}

function details(questionnaire){
    fillFormQuestionnaire(formQuestionnaire(), questionnaire);
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

    let tools = document.getElementById('tools');

    let save = tools.querySelector('#saveQuestionnaire');
    if (!save){
        save = document.createElement('img');
        save.id = 'saveQuestionnaire';
        save.src = 'img/save.png';
        tools.append(save);
    }

    if (isnew){
        save.alt = 'Enregistrer le questionnaire';
        save.onclick = function(){
            saveNewQuestionnaire(titreQuestionnaireInput.value);
        }
    }
    else{
        save.alt = 'Sauvegarder le changement';
        save.onclick = function(){
            saveModifiedQuestionnaire(titreQuestionnaireInput.value);
        };
    }
    return currentQuestionnaire;
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
    saveQuestion.onclick = function(){
        saveNewQuestion(formQuestionnaire, liQuestion);
    }
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
    deleteQuestionButton.onclick = function(){
        deleteQuestion(formQuestion);
    }
    boutons.append(deleteQuestionButton);

    let saveQuestion = document.createElement('img');
    saveQuestion.src = 'img/save.png';
    saveQuestion.onclick = function(){
        saveModifiedQuestion(formQuestion, dataQuestion);
    }
    boutons.append(saveQuestion);
}

function fillFormQuestionnaire(formQuestionnaire, dataQuestionnaire){
    formQuestionnaire.querySelector('#titreQuestionnaire').setAttribute('questionnaireId', dataQuestionnaire.id);
    formQuestionnaire.querySelector('#titreQuestionnaireInput').value = dataQuestionnaire.name;
    dataQuestionnaire.questions.forEach(question => {
        fillFormQuestion(formQuestion(formQuestionnaire), question);
    });
    let newQuestion = document.createElement('img');
    document.getElementById('currentQuestionnaire').append(newQuestion);
    newQuestion.src = "img/new.png";
    newQuestion.onclick = function(){
        formQuestion(formQuestionnaire);
    };
}

function saveModifiedQuestionnaire(title){
    let titreQuestionnaire = document.getElementById('titreQuestionnaire');
    if (title == ''){
        // Client error
        onerror('Il est impossible de modifier un questionnaire avec un titre vide');
    }
    else if (titreQuestionnaire){
        // Création de la requête permettant de modifier le questionnaire
        fetch('http://localhost:5000/api/questionnaires',{
            headers: {'Content-Type': 'application/json'},
            method: 'PUT',
            body: JSON.stringify({"questionnaire_id":titreQuestionnaire.getAttribute('questionnaireId'),"name":title})
        })
        .then(response => {
            if (response.ok){
                console.log('Update Success');
                refreshQuestionnaireList();
                return response.json()
            }
            else throw new Error('Problème ajax: ' + response.status);
        })
        .catch(onerror);
    }
}


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
            if (response.ok){
                console.log('Insert Success');
                refreshQuestionnaireList();
                return response.json();
            }
            else throw new Error('Problème ajax: ' + response.status);
        })
        .then(dataQuestionnaire => {
            getDetailQuestionnaire(dataQuestionnaire);
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
            if (response.ok){
                console.log('Delete Success');
                refreshQuestionnaireList();
                return response.json();
            }
            else throw new Error('Problème ajax: ' + response.status);
        })
        .then(dataQuestionnaire => {
            console.log('Supression du questionnaire ' + dataQuestionnaire.name);
            clearContent(document.getElementById('currentQuestionnaire'));
        })
        .catch(onerror);
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
            console.log('Delete Success');
            refreshQuestionnaireList();
            return response.json();
        }
        else throw new Error('Problème ajax: ' + response.status);
    })
    .then(dataQuestion => {
        console.log('Supression de la question ' + dataQuestion.title);
        formQuestion.remove();
    })
    .catch(onerror);
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
            onerror("Il n'est pas possible d'avoir un titre vide");
        }
    }
    if (dataQuestion.type != type){
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
            if (response.ok){
                console.log('Update Success');
                return response.json();
            }
            else throw new Error('Problème ajax: ' + response.status);
        })
        .then(dataQuestion => {
            fillFormQuestion(formQuestion, dataQuestion)
        })
        .catch(onerror);
    }
    else{
        // Client error
        onerror("Aucun changement de fait");
    }
}

function saveNewQuestion(formQuestionnaire, formQuestion){
    let title = formQuestion.querySelector('#titreQuestion').value; // Récupère la valeur du title de la question
    let type = formQuestion.querySelector('#typeQuestion').value; // Récupère la valeur du type de la question
    let questionnaireId = formQuestionnaire.querySelector('#titreQuestionnaire').getAttribute('questionnaireId');

    const errors = [];
    if (!title) errors.push("Il est impossible de créer une question avec un title vide");
    if (!type) errors.push("Il est impossible de créer une question avec un type vide");
    if (errors.length){
        // Client error
        errors.forEach(error => onerror(error));
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
                console.log('Insert Success');
                refreshQuestionnaireList();
                return response.json();
            }
            else throw new Error('Problème ajax: ' + response.status);
        })
        .then(dataQuestion => {
            fillFormQuestion(formQuestion, dataQuestion)
        })
        .catch(onerror);
    }
}