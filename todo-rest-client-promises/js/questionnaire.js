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

    console.log("Impossible de récupérer les questionnaires à réaliser ! " + err);

    // let error = document.createElement("b");
    // error.textContent = "Impossible de récupérer les questionnaires à réaliser !";
    // let questionnaires = document.getElementById('questionnaires');
    // questionnaires.appendChild(error);
    // questionnaires.appendChild(document.createTextNode(' ' + err));
}

function refreshQuestionnaireList(){
    clearContent(document.getElementById('questionnaires'));
    fetch("http://127.0.0.1:5000/api/questionnaires")
    .then(response => {
        if (response.ok) return response.json();
        else throw new Error('Problème ajax: ' + response.status);
    })
    .then(remplirQuestionnaires)
    .catch(onerror);
}

function getDetailQuestionnaire(questionnaire) {
    fetch("http://127.0.0.1:5000" + questionnaire.uri)
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
    titreQuestionnaire.textContent = "Titre";
    titreQuestionnaire.setAttribute('id', 'titreQuestionnaire');
    currentQuestionnaire.append(titreQuestionnaire);

    let titreQuestionnaireInput = document.createElement('input');
    titreQuestionnaireInput.setAttribute('type', 'text');
    titreQuestionnaireInput.setAttribute('id', 'titreQuestionnaireInput');
    titreQuestionnaire.append(titreQuestionnaireInput);
    
    let questionsQuestionnaire = document.createElement('ul');
    questionsQuestionnaire.setAttribute('id', 'listeQuestions');
    currentQuestionnaire.append(questionsQuestionnaire);

    let save = document.createElement("button");
    currentQuestionnaire.append(save);

    let saveImg = document.createElement("img");
    saveImg.setAttribute('id', 'saveQuestionnaire');
    saveImg.setAttribute('src', 'img/save.png');
    save.append(saveImg);

    if (isnew){
        // save envoie une requête POST pour enregistrer ce nouveau questionnaire
    }
    else{
        // save envoie une requête PUT pour enregistrer la modification du questionnaire
        saveImg.setAttribute('alt', 'Sauvegarder le changement');
        save.onclick = function() {
            saveModifiedQuestionnaire();
        };
    }
}

function fillFromQuestionnaire(json){
    document.getElementById('titreQuestionnaire').setAttribute('questionnaireId', json.id);
    document.getElementById('titreQuestionnaireInput').setAttribute('value', json.name);
    let questionsQuestionnaire = document.getElementById('listeQuestions');
    json.questions.forEach(question => {
        // Création de l'élément li
        let liQuestion = document.createElement('li');
        liQuestion.style.border = "0.1em solid black";
        questionsQuestionnaire.append(liQuestion);

        // Création de l'élément du titre de la question
        let titreQuestion = document.createElement('p');
        titreQuestion.textContent = question.title;
        liQuestion.append(titreQuestion);

        // Création de l'élément du type de la question
        let typeQuestion = document.createElement('p');
        typeQuestion.textContent = question.type;
        liQuestion.append(typeQuestion);
    });
}

function saveModifiedQuestionnaire(){
    let titreQuestionnaireInput = document.getElementById('titreQuestionnaireInput');
    let titreQuestionnaire = document.getElementById('titreQuestionnaire');
    // Création de la requête permettant de modifier le questionnaire
    fetch("http://localhost:5000/api/questionnaires",{
        headers: {'Content-Type': 'application/json'},
        method: "PUT",
        body: `{"questionnaire_id":${titreQuestionnaire.getAttribute('questionnaireId')},"name":"${titreQuestionnaireInput.value}"}`
    })
    .then(response => {
        if (response.ok) {
            console.log('Update Success');
            refreshQuestionnaireList();
            return response.json();
        }
        else throw new Error('Problème ajax: ' + response.status);
    })
    .then(json => titreQuestionnaireInput.setAttribute('value', json.name))
    .catch(res => console.log(res));
}

    // class Task{
    //     constructor(title, description, done, uri){
    //         this.title = title;
    //         this.description = description;
    //         this.done = done;
    //         this.uri = uri;
    //         console.log(this.uri);
    //     }
    // }


    // $("#tools #add").on("click", formTask);
    // $('#tools #del').on('click', delTask);

    // function formTask(isnew){
    //     $("#currentQuestionnaire").empty();
    //     $("#currentQuestionnaire")
    //         .append($('<span>Titre<input type="text" id="titre"><br></span>'))
    //         .append($('<span>Description<input type="text" id="descr"><br></span>'))
    //         .append($('<span>Done<input type="checkbox" id="done"><br></span>'))
    //         .append($('<span><input type="hidden" id="turi"><br></span>'))
    //         .append(isnew?$('<span><input type="button" value="Save Task"><br></span>').on("click", saveNewTask)
    //                      :$('<span><input type="button" value="Modify Task"><br></span>').on("click", saveModifiedTask)
    //             );
    //     }

    // function fillFormTask(t){
    //     $("#currentQuestionnaire #titre").val(t.title);
    //     $("#currentQuestionnaire #descr").val(t.description);
    //      t.uri=(t.uri == undefined)?"http://127.0.0.1:5000/todo/api/v1.0/tasks"+t.id:t.uri;
    //      $("#currentQuestionnaire #turi").val(t.uri);
    //     t.done?$("#currentQuestionnaire #done").prop('checked', true):
    //     $("#currentQuestionnaire #done").prop('checked', false);
    // }

    // function saveNewTask(){
    //     var task = new Task(
    //         $("#currentQuestionnaire #titre").val(),
    //         $("#currentQuestionnaire #descr").val(),
    //         $("#currentQuestionnaire #done").is(':checked')
    //         );
    //     console.log(JSON.stringify(task));
    //     fetch("http://127.0.0.1:5000/todo/api/v1.0/tasks",{
    //     headers: {
    //       'Accept': 'application/json',
    //       'Content-Type': 'application/json'
    //     },
    //     method: "POST",
    //     body: JSON.stringify(task)
    //         })
    //     .then(res => { console.log('Save Success') ;
    //                    $("#result").text(res['contenu']);
    //                    refreshQuestionnaireList();
    //                })
    //     .catch( res => { console.log(res) });
    // }

//     function delTask(){
//         if ($("#currentQuestionnaire #turi").val()){
//         url = $("#currentQuestionnaire #turi").val();
//         fetch(url,{
//         headers: {
//           'Accept': 'application/json',
//           'Content-Type': 'application/json'
//         },
//         method: "DELETE"
//             })
//         .then(res => { console.log('Delete Success:' + res); } )
//         .then(refreshQuestionnaireList)
//         .catch( res => { console.log(res);  });
//     }
//   }

