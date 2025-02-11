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
    let questionnaires = document.getElementById('questionnaires');
    let liste = document.createElement('ul');
    questionnaires.append(liste);
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
  let error = document.createElement("b");
  error.textContent = "Impossible de récupérer les questionnaires à réaliser !";
  questionnaires = document.getElementById('questionnaires');
  questionnaires.appendChild(error);
  questionnaires.appendChild(document.createTextNode(" " + err));
}

function refreshQuestionnaireList(){
    let questionnaires = document.getElementById('questionnaires');
    clearContent(questionnaires);
    requete = "http://127.0.0.1:5000/api/questionnaires";
    fetch(requete)
    .then(response => {
        if (response.ok) return response.json();
        else throw new Error('Problème ajax: '+response.status);
        }
    )
    .then(remplirQuestionnaires)
    .catch(onerror);
}

function getDetailQuestionnaire(questionnaire) {
    requete = "http://127.0.0.1:5000" + questionnaire.uri;
    fetch(requete)
    .then(response => {
        if (response.ok) return response.json();
        else throw new Error('Problème ajax: '+response.status);
        }
    )
    .then(
        jsonQuestions => {
            questionnaire.questions = jsonQuestions;
            details(questionnaire)
        }
    )
    .catch(onerror);
}

function details(json){
    formQuestionnaire();
    fillFromQuestionnaire(json);
}

function formQuestionnaire(isnew){
    let currentQuestionnaire = document.getElementById('currentQuestionnaire');
    clearContent(currentQuestionnaire);

    let titreQuestionnaire = document.createElement('h1');
    titreQuestionnaire.textContent = "Titre"
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
    if (isnew){
        // save envoie une requête POST pour enregistrer ce nouveau questionnaire
    }
    else{
        // save envoie une requête PUT pour enregistrer la modification du questionnaire
        save.textContent = "Sauvegarder le changement";
        save.onclick = function() {
            saveModifiedQuestionnaire();
        };
    }
}

function fillFromQuestionnaire(json){
    let titreQuestionnaire = document.getElementById('titreQuestionnaire');
    titreQuestionnaire.setAttribute('questionnaireId', json.id)
    let titreQuestionnaireInput = document.getElementById('titreQuestionnaireInput');
    titreQuestionnaireInput.setAttribute('value', json.name);
    let questionsQuestionnaire = document.getElementById('listeQuestions');
    json.questions.forEach(question => {
        let liQuestion = document.createElement('li');
        liQuestion.style.border = "0.1em solid black";
        let titreQuestion = document.createElement('p');
        titreQuestion.textContent = question.title;
        let typeQuestion = document.createElement('p');
        typeQuestion.textContent = question.type;
        liQuestion.append(titreQuestion);
        liQuestion.append(typeQuestion);
        questionsQuestionnaire.append(liQuestion);
    });
}
// curl -i -H "Content-Type: application/json" -X PUT -d '{"questionnaire_id":1,"name":"new_name"}' http://localhost:5000/api/questionnaires
function saveModifiedQuestionnaire(){
    let titreQuestionnaireInput = document.getElementById('titreQuestionnaireInput');
    let titreQuestionnaire = document.getElementById('titreQuestionnaire');
    fetch("http://localhost:5000/api/questionnaires",{
        headers: {
          'Content-Type': 'application/json'
        },
        method: "PUT",
        body: `{"questionnaire_id":${titreQuestionnaire.getAttribute('questionnaireId')},"name":"${titreQuestionnaireInput.value}"}`
    })
    .then(response => {
        console.log('Update Success');
        refreshQuestionnaireList();
        if (response.ok) return response.json();
        else throw new Error('Problème ajax: '+response.status);
    })
    .then(json => titreQuestionnaireInput.setAttribute('value', json.name))
    .catch( res => { console.log(res) });
}

// function saveModifiedTask(){
//     var task = new Task(
//         $("#currentQuestionnaire #titre").val(),
//         $("#currentQuestionnaire #descr").val(),
//         $("#currentQuestionnaire #done").is(':checked'),
//         $("#currentQuestionnaire #turi").val()
//         );
//     console.log("PUT");
//     console.log(task.uri);
//     console.log(JSON.stringify(task));
    // fetch(task.uri,{
    // headers: {
    //   'Accept': 'application/json',
    //   'Content-Type': 'application/json'
    // },
    // method: "PUT",
    // body: JSON.stringify(task)
    //     })
//     .then(res => { console.log('Update Success');  refreshQuestionnaireList();} )
//     .catch( res => { console.log(res) });
// }

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

