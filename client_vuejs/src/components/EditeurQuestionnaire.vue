<script>
export default {
  props: {
    questionnaire: Object,
    questions: Array
  },
  data() {
    return {
      have_new_question : false
    };
  },
  methods: {
    async saveNewQuestionnaire() {
      if (!this.titreQuestionnaire) {
        alert('Il est impossible de créer un questionnaire avec un titre vide');
        return;
      }
      try {
        const response = await fetch('http://localhost:5000/api/questionnaires', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: this.titreQuestionnaire })
        });
        if (!response.ok) throw new Error('Erreur lors de la création');
        alert('Insert Success');
        this.$emit('getQuestionnaire');
      } catch (error) {
        console.error(error);
        alert('Erreur serveur');
      }
    },

    newQuestionnaire(){
      this.$emit('set_id_current_questionnaire', null)
    },

    async deleteQuestionnaire() {
      try {
        const response = await fetch(`http://localhost:5000/api/questionnaires/${this.questionnaire.id}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error('Erreur lors de la suppression');
        alert('Delete Success');
        this.$emit('getQuestionnaire');
      } catch (error) {
        console.error(error);
        alert('Erreur serveur');
      }
    },

    newQuestion(){
      if (! this.have_new_question){
        this.have_new_question = true
      }
    },

    deleteQuestion(questionId){
      fetch('http://localhost:5000/api/questionnaires/' + this.questionnaire.id + '/questions/' + questionId,{
            headers: {'Content-Type': 'application/json'},
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok){
                alert('Delete Success');
                this.$emit('getQuestions');
                return response.json();
            }
            else throw new Error('Problème ajax: ' + response.status);
        })
        .then(dataQuestion => {
            alert(`Supression de la question ${dataQuestion.title}`);
        })
    },


    


  },
  watch: {
    questionnaire: {
      handler(newquestionnaire) {
            if (newquestionnaire) {
                this.have_new_question = false;
            }
        },
    }
  }


  
};
</script>

<template>
  <h2>Éditeur de Questionnaires</h2>
  <section id="tools">
    <img id="add" src="/img/new.png" alt="Nouveau questionnaire" @click="newQuestionnaire" />
    <img id="save" src="/img/save.png" alt="save questionnaire" @click="saveNewQuestionnaire" />
    <img v-if="questionnaire" id="del" src="/img/delete.png" alt="delete questionnaire" @click="deleteQuestionnaire" />
  </section>
  <section>
    <div v-if="questionnaire">
      <h1>
        Titre:
        <input v-model="questionnaire.name" type="text"/>
      </h1>
      <ul>
        <li v-for="question in questions" >
          <p>Titre <input v-model="question.title" type="text"></p>
          <p>
            Type <select v-model="question.type">
              <option value="text">text</option>
              <option value="multiple">multiple</option>
            </select>
          </p>
          <div>
            <img id="save" src="/img/save.png" alt="save question" @click="" />
            <img v-if="questionnaire"  src="/img/delete.png" alt="delete questionnaire" @click="deleteQuestion(question.id)" />
          </div>
          
        </li>
        <li v-if="have_new_question">
          <p>Titre <input type="text"></p>
          <p>
            Type <select>
              <option value="text">text</option>
              <option value="multiple">multiple</option>
            </select>
            <div>
              <img id="save" src="/img/save.png" alt="save question" @click="" />
            </div>
          </p>
        </li>
      </ul>
      <img id="add" src="/img/new.png" alt="Nouveau questionnaire" @click="newQuestion" />
    </div>
    <div v-else class="form-questionnaire">
      <h1>
        Titre:
        <input type="text" />
      </h1>
    </div>
  </section>
  <section id="currentQuestionnaire">
    
  </section>
</template>