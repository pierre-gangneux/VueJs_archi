<script>
import questionnaire from './components/Questionnaire.vue';

export default {
  data() {
    return {
      questionnaires: [
      ],
      title: 'Questionnaires',
      newItem: ''
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
        console.log($event.name)
      }
    },
    getQuestionnaires(){
      console.log("te ")
      fetch('http://127.0.0.1:5000/api/questionnaires')
      .then(response => response.json())
      .then(json=>{
        console.log(json)
        this.questionnaires = json
      })
    }
  },
  mounted() {
    // this.getQuestionnaires();
    console.log("mounted");
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
    
</nav>

<article>
  <h2>Editeur de Questionnaires</h2>
  <section id="tools">
    <img id="add" src="/img/new.png" alt="Nouveau questionnaire"/>
  </section>
  <section id="currentQuestionnaire"></section>
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