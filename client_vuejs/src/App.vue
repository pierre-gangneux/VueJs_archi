<script>
import questionnaire from './components/Questionnaire.vue';
import Utilitaire from './Utilitaire.js';

export default {
  data() {
    return {
      questionnaires: [],
      title: 'Questionnaires',
      newItem: ''
    };
  },
  methods: {
    addItem() {
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
    get_questionnaire_by_id: function (id) {
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
    getQuestionnaires(){
      fetch('http://127.0.0.1:5000/api/questionnaires')
      .then(response => response.json())
      .then(json=>{
        this.questionnaires = json;
      })
    },
    getQuestionnaire(id){
      for (let i=0; i < this.questionnaires.length; i++){
        if (this.questionnaires[i].id==id) return this.questionnaires[i];
      }
    },
    getQuestions(id){
      // TODO
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
              // QuestionnaireListe.getQuestionnaireListe().getQuestionnaire(dataQuestionnaire.id).details();
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
                  return response.json();
              }
              else throw new Error('Problème ajax: ' + response.status);
          })
          .then(dataQuestion => {
            this.getQuestionnaires()
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
    editQuestionnaire(questionnaireId, questionId, title, type, old_title, old_type){
        let bodyRequest = {};
        if (old_title != title){
            if (title != '') bodyRequest.title = title;
            else Utilitaire.errorClient("Il n'est pas possible d'avoir un titre vide");
        }
        if (old_type != type){
            if (type != '') bodyRequest.type = type;
            else Utilitaire.errorClient("Il n'est pas possible d'avoir un type vide");
        }
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
  mounted() {
    // this.getQuestionnaires();
    // console.log("mounted");
  },
  components: { questionnaire }
};
</script>

<template>

<nav id="nav1">
  <h2>{{ title }}</h2>
    <input id="button" type="button" value="Recuperer les questionnaires" @click="getQuestionnaires"/>
    <ol>
      <questionnaire 
        v-for="questionnaire in questionnaires"
        :key="questionnaire.id"
        :questionnaire="questionnaire"
        :class="{ 'alert alert-success': questionnaire.checked }"
        @remove="remove"
        @edit="edit"
      >
        {{ questionnaire.name }}
      </questionnaire>
    </ol>
    <div class="input-group">
      <input
        v-model="newItem"
        @keyup.enter="addItem"
        placeholder="Ajouter un Questionnaire"
        type="text"
        class="form-control"
      />
      <button @click="addItem" class="btn btn-primary">Ajouter</button>
    </div>
</nav>

<article>
  <h2>Editeur de Questionnaires</h2>
  <section id="tools">
    <img id="add" src="/img/new.png" alt="Nouveau questionnaire"/>
  </section>
  <section id="currentQuestionnaire"></section>
</article>

</template>
