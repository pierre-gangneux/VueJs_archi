<script>
import questionnaire from './components/Questionnaire.vue';

export default {
  data() {
    return {
      questionnaires: [
        { id: 1, text: 'Faire les courses', checked: true },
        { id: 2, text: 'Apprendre REST', checked: false }
      ],
      title: 'Mes tâches',
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
        console.log($event.name)
      }
    },
    getQuestionnaires(){
      fetch('http://127.0.0.1:5000/api/questionnaires')
      .then(response => response.json())
      .then(json=>{
        console.log(json)
        this.questionnaires = json
      })
    }
  },
  mounted() {
    this.getQuestionnaires();
    console.log("mounted");
  },
  components: { questionnaire }
};
</script>

<template>
  <div class="container">
    <h2>{{ title }}</h2>
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
        placeholder="Ajouter une tâche"
        type="text"
        class="form-control"
      />
      <button @click="addItem" class="btn btn-primary">Ajouter</button>
    </div>
  </div>
</template>
