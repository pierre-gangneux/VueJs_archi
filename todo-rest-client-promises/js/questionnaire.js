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
            // TODO -> Ajouter un lien pour afficher le détail
            console.log("Détail Questionnaire n° " + questionnaire.id + "\n" + questionnaire.uri);
            getDetailQuestionnaire(questionnaire);
        });
        liste.append(questionnaire_li);
    });
}

function onerror(err) {
  let error = document.createElement("b");
  error.textContent = "Impossible de récupérer les questionnaires à réaliser !";
  questionnaires = document.getElementById('questionnaires');
  questionnaires.append(error);
  questionnaires.textContent = err;
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
    console.log(questionnaire);
    requete = "http://127.0.0.1:5000" + questionnaire.uri;
    console.log(requete);
    fetch(requete)
    .then(response => {
        if (response.ok) return response.json();
        else throw new Error('Problème ajax: '+response.status);
        }
    )
    .then(json => console.log(json))
    .catch(onerror);
}

    // function details(event){
    //     $("#currentQuestionnaire").empty();
    //     formTask();
    //     fillFormTask(event.data);
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
    //     fetch(task.uri,{
    //     headers: {
    //       'Accept': 'application/json',
    //       'Content-Type': 'application/json'
    //     },
    //     method: "PUT",
    //     body: JSON.stringify(task)
    //         })
    //     .then(res => { console.log('Update Success');  refreshQuestionnaireList();} )
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

