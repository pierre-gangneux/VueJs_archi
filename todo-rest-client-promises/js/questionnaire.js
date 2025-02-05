

function clear(element){
    while(element.firstChild){
        element.removeChild(element.firstChild);
    }
}
     
let button = document.getElementById('button');
console.log(button);
button.addEventListener('click', function(){
    refreshQuestionnaireList();
});

function remplirQuestionnaires(json){
    let questionnaires = document.getElementById('questionnaires');
    clear(questionnaires);
    let liste = document.createElement('ul');
    questionnaires.append(liste);
    json.forEach(questionnaire => {
        let questionnaire_li = document.createElement('li');
        questionnaire_li.textContent = questionnaire.name;
        liste.append(questionnaire_li);
    });
}

    // function remplirTaches(repjson) {
    //   console.log(JSON.stringify(repjson));
    //   $('#questionnaires').empty();
    //   $('#questionnaires').append($('<ul>'));
    //   for(questionnaire of repjson){
    //       console.log(questionnaire);
    //       $('#questionnaires ul')
    //             .append($('<li>')
    //             .append($('<a>')
    //             .text(questionnaire.name)
    //                 ).on("click", questionnaire, details)
    //             );
    //     }
    //   }

      function onerror(err) {
          $("#questionnaires").html("<b>Impossible de récupérer les questionnaires à réaliser !</b>"+err);
      }

    function refreshQuestionnaireList(){
        $("#currentQuestionnaire").empty();
        requete = "http://127.0.0.1:5000/api/questionnaires";
        fetch(requete)
        .then(response => {
                  if (response.ok) return response.json();
                  else throw new Error('Problème ajax: '+response.status);
                }
            )
        // .then(remplirTaches)
        .then(remplirQuestionnaires)
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

