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
    .catch(errorServeur);
}

function details(questionnaire){
    fillFormQuestionnaire(formQuestionnaire(), questionnaire);
}

function formQuestionnaire(isnew){
    let currentQuestionnaire = document.getElementById('currentQuestionnaire');
    clearContent(currentQuestionnaire);
    // A changer pour permettre une meilleur flexibilité
    let form = document.createElement('div');
    currentQuestionnaire.append(form);

    let titreQuestionnaire = document.createElement('h1');
    titreQuestionnaire.textContent = 'Titre';
    titreQuestionnaire.id = 'titreQuestionnaire';
    form.append(titreQuestionnaire);

    let titreQuestionnaireInput = document.createElement('input');
    titreQuestionnaireInput.type = 'text';
    titreQuestionnaireInput.id = 'titreQuestionnaireInput';
    titreQuestionnaire.append(titreQuestionnaireInput);
    
    let questionsQuestionnaire = document.createElement('ul');
    questionsQuestionnaire.id = 'listeQuestions';
    form.append(questionsQuestionnaire);

    let tools = document.getElementById('tools');

    let del = tools.querySelector('#del');
    if (!del){
        if (!isnew){
            del = document.createElement('img');
            del.id = 'del';
            del.src = 'img/delete.png';
            del.onclick = () => deleteQuestionnaire(form);
            tools.append(del);
        }
    }
    else{
        if (isnew){
            del.remove();
        }
        else{
            del.onclick = () => deleteQuestionnaire(form);
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
        save.onclick = () => saveNewQuestionnaire(form);
    }
    else{
        save.alt = 'Sauvegarder le changement';
        save.onclick = () => saveModifiedQuestionnaire(form);
    }
    return form;
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

function fillFormQuestionnaire(formQuestionnaire, dataQuestionnaire){
    formQuestionnaire.querySelector('#titreQuestionnaire').setAttribute('questionnaireId', dataQuestionnaire.id);
    formQuestionnaire.querySelector('#titreQuestionnaireInput').value = dataQuestionnaire.name;
    dataQuestionnaire.questions.forEach(question => {
        fillFormQuestion(formQuestion(formQuestionnaire), question);
    });
    let newQuestion = document.createElement('img');
    formQuestionnaire.append(newQuestion);
    newQuestion.src = "img/new.png";
    newQuestion.onclick = () => formQuestion(formQuestionnaire);
}

function saveModifiedQuestionnaire(formQuestionnaire){
    let name = formQuestionnaire.querySelector('#titreQuestionnaireInput').value
    if (name == ''){
        errorClient('Il est impossible de modifier un questionnaire avec un titre vide');
    }
    else{
        // Création de la requête permettant de modifier le questionnaire
        fetch('http://localhost:5000/api/questionnaires',{
            headers: {'Content-Type': 'application/json'},
            method: 'PUT',
            body: JSON.stringify({"questionnaire_id":formQuestionnaire.querySelector('#titreQuestionnaire').getAttribute('questionnaireId'),"name":name})
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


// curl -i -H "Content-Type: application/json" -X POST -d '{"name":"test"}' http://localhost:5000/api/questionnaires
function saveNewQuestionnaire(formQuestionnaire){
    let name = formQuestionnaire.querySelector('#titreQuestionnaireInput').value
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

function deleteQuestionnaire(formQuestionnaire){
    // Création de la requête permettant de modifier le questionnaire
    fetch('http://localhost:5000/api/questionnaires',{
        headers: {'Content-Type': 'application/json'},
        method: 'DELETE',
        body: JSON.stringify({"questionnaire_id":formQuestionnaire.querySelector('#titreQuestionnaire').getAttribute('questionnaireId')})
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
        formQuestionnaire.remove();
        document.getElementById('del').remove();
        document.getElementById('save').remove();
    })
    .catch(errorServeur);
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