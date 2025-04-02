<script>
import questionnaire from './components/Questionnaire.vue';
import editeurQuestionnaire from './components/EditeurQuestionnaire.vue';
import Utilitaire from './Utilitaire.js';

export default {
  data() {
    return {
      questionnaires: [],
      title: 'Questionnaires',
      newItem: '',
      id_current_questionnaire : null,
      questions : []
    };
  },
  methods: {
    addQuestionnaire() {
      let name = this.newItem.trim();
      if (name) {
        fetch('http://localhost:5000/api/questionnaires',{
          headers: {'Content-Type': 'application/json'},
          method: 'POST',
          body: JSON.stringify({"name":name})
      })
      .then(() =>{
        this.getQuestionnaires();

      })
      }
    },
    get_questionnaire_by_id(id) {
      console.log("get")
      for (let i=0; i < this.questionnaires.length; i++){
        if (this.questionnaires[i].id==id){
          return this.questionnaires[i];
        }
      }
    },
    remove ($event) {
      this.questionnaires = this.questionnaires.filter(questionnaire => questionnaire.id !== $event.id);
    },
    edit($event) {
      let questionnaire = this.questionnaires.find(t => t.id === $event.id);
      if (questionnaire) {
        questionnaire.name = $event.name;
      }
    },

    set_id_current_questionnaire($event){
      
      this.id_current_questionnaire = $event
      console.log(this.id_current_questionnaire)
    },


    getQuestionnaires(){
      fetch('http://127.0.0.1:5000/api/questionnaires')
      .then(response => response.json())
      .then(json=>{
        this.questionnaires = json;
      })
    },

    async getQuestions() {
      let currentQuestionnaire = this.get_questionnaire_by_id(this.id_current_questionnaire);
      
      if (!currentQuestionnaire) {
          console.error("Questionnaire non trouvé !");
          return;
      }

      try {
          const response = await fetch('http://127.0.0.1:5000' + currentQuestionnaire.uri);
          if (!response.ok) throw new Error('Problème ajax: ' + response.status);

          const dataQuestions = await response.json();
          this.questions = dataQuestions.map(dataQuestion => ({
              id: dataQuestion.id,
              title: dataQuestion.title,
              type: dataQuestion.type
          }));

          console.log("Questions récupérées :", this.questions);
      } catch (error) {
          console.error(error);
      }
  },

  

  getQuestionnaire(id){
      for (let i=0; i < this.questionnaires.length; i++){
        if (this.questionnaires[i].id==id) return this.questionnaires[i];
      }
  },
  
    getQuestionnairesQuestions(id){
      let questionnaire = this.getQuestionnaire(id);
      fetch('http://127.0.0.1:5000' + questionnaire.uri)
      .then(response => {
          if (response.ok) return response.json();
          else throw new Error('Problème ajax: ' + response.status);
      })
      .then(dataQuestions => {
        questionnaire.questions = []
        dataQuestions.forEach(dataQuestion => questionnaire.questions.push(new Question(dataQuestion)));
      })
      .catch(Utilitaire.errorServeur);
    },
    getQuestionnairesQuestion(questionnaireId, questionId){
      let questionnaire = this.getQuestionnaire(questionnaireId);
      if ("questions" in questionnaire){
        let questions = questionnaire.questions;
        for (let i=0; i < questions.length; i++){
          if (questions[i].id==questionId) return questions[i];
        }
      }
    },

    createQuestionnaire(name){
      if (name == ''){
          Utilitaire.errorClient('Il est impossible de créer un questionnaire avec un titre vide');
      }
      else{
          fetch('http://localhost:5000/api/questionnaires',{
              headers: {'Content-Type': 'application/json'},
              method: 'POST',
              body: JSON.stringify({"name":name})
          })
          .then(response => {
              if (response.ok){
                  Utilitaire.successMessage('Insert Success');
                  return response.json();
              }
              else throw new Error('Problème ajax: ' + response.status);
          })
          .then(async dataQuestionnaire => {
            this.getQuestionnaires();
          })
          .catch(Utilitaire.errorServeur);
      }
    },

    createQuestion(questionnaireId, title, type){
      const errors = [];
      if (!title) errors.push("Il est impossible de créer une question avec un title vide");
      if (!type) errors.push("Il est impossible de créer une question avec un type vide");
      if (errors.length){
          errors.forEach(error => Utilitaire.errorClient(error));
      }
      else {
          fetch('http://localhost:5000/api/questionnaires/'+ questionnaireId +'/questions',{
          headers: {'Content-Type': 'application/json'},
          method: 'POST',
          body: JSON.stringify({"title": title, "type": type})
          })
          .then(response => {
              if (response.ok){
                  Utilitaire.successMessage('Insert Success');
                  this.getQuestions();
                  return response.json();
              }
              else throw new Error('Problème ajax: ' + response.status);
          })
          .catch(Utilitaire.errorServeur);
      }
    },

    editQuestionnaire(questionnaireId, name, old_name){
      const errors = [];
      if (name == '') errors.push('Il est impossible de modifier un questionnaire avec un titre vide');
      if (name == old_name) errors.push("Le titre du questionnaire n'a pas changé");
      if (errors.length){
          errors.forEach(error => Utilitaire.errorClient(error));
      }
      else{
          fetch('http://localhost:5000/api/questionnaires/' + questionnaireId, {
              headers: {'Content-Type': 'application/json'},
              method: 'PUT',
              body: JSON.stringify({"name": name})
          })
          .then(response => {
              if (response.ok){
                  Utilitaire.successMessage('Update Success');
                  return response.json();
              }
              else throw new Error('Problème ajax: ' + response.status);
          })
          .then(async dataQuestionnaire => {
            this.getQuestionnaires()
          })
          .catch(Utilitaire.errorServeur);
      }
    },

    editQuestion(questionnaireId, questionId, title, type){
        let bodyRequest = {};
        if (title != '') bodyRequest.title = title;
        else Utilitaire.errorClient("Il n'est pas possible d'avoir un titre vide");
        if (type != '') bodyRequest.type = type;
        else Utilitaire.errorClient("Il n'est pas possible d'avoir un type vide");
        if (Object.keys(bodyRequest).length >= 1){
            fetch('http://localhost:5000/api/questionnaires/' + questionnaireId + '/questions/' + questionId,{
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
            .then(async dataQuestion => {
                this.getQuestionnaires();
            })
            .catch(Utilitaire.errorServeur);
        }
        else{
            Utilitaire.errorClient("Aucun changement de fait");
        }
    },

    deleteQuestionnaire(questionnaireId){
      fetch('http://localhost:5000/api/questionnaires/' + questionnaireId,{
            headers: {'Content-Type': 'application/json'},
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok){
                Utilitaire.successMessage('Delete Success');
                this.getQuestionnaires();
                return response.json();
            }
            else throw new Error('Problème ajax: ' + response.status);
        })
        .then(dataQuestionnaire => {
            Utilitaire.successMessage(`Supression du questionnaire ${dataQuestionnaire.name}`);
        })
        .catch(Utilitaire.errorServeur);
    },

    deleteQuestion(questionnaireId, questionId){
      fetch('http://localhost:5000/api/questionnaires/' + questionnaireId + '/questions/' + questionId,{
            headers: {'Content-Type': 'application/json'},
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok){
                Utilitaire.successMessage('Delete Success');
                this.getQuestionnaires();
                return response.json();
            }
            else throw new Error('Problème ajax: ' + response.status);
        })
        .then(dataQuestion => {
            Utilitaire.successMessage(`Supression de la question ${dataQuestion.title}`);
        })
        .catch(Utilitaire.errorServeur);
    },

},
watch: {
    id_current_questionnaire: {
        handler(newId) {
            if (newId) {
                this.getQuestions();
            }
        },
        immediate: true
    }
},

components: { questionnaire, editeurQuestionnaire }
};
</script>

<template>

<nav id="nav1">
  <h2>{{ title }}</h2>
    <input id="button" type="button" value="Recuperer les questionnaires" @click="getQuestionnaires"/>
    <ol>
      <questionnaire 
        v-for="questionnaire in questionnaires"
        :questionnaire="questionnaire"
        @set_id_current_questionnaire="set_id_current_questionnaire"
      >
        {{ questionnaire.name }}
      </questionnaire>
    </ol>
    
</nav>

<article>
  <editeurQuestionnaire
    :questionnaire="get_questionnaire_by_id(id_current_questionnaire)"
    :questions="this.questions"
    @getQuestionnaire="getQuestionnaires"
    @set_id_current_questionnaire="set_id_current_questionnaire"
    @editQuestionnaire="editQuestionnaire"
    @createQuestion="createQuestion"
    @editQuestion="editQuestion"
  />
</article>


</template>


<!-- <div class="input-group">
  <input
    v-model="newItem"
    @keyup.enter="addItem"
    placeholder="Ajouter un Questionnaire"
    type="text"
    class="form-control"
  />
  <button @click="addQuestionnaire" class="btn btn-primary">Ajouter</button>
</div> -->