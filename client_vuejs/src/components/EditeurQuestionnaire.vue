<script>
export default {
  props: {
    questionnaire: Object,
  },
  data() {
    return {
      titreQuestionnaire: this.questionnaire?.name || '',
      questions: this.questionnaire?.questions || [],
      isNew: true
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
    <div v-else class="form-questionnaire">
      <h1>
        Titre:
        <input v-model="titreQuestionnaire" type="text" />
      </h1>
      <ul v-if="!isNew">
        <li v-for="(question, index) in questions" :key="index">
          {{ question.text }}
        </li>
      </ul>
     
    </div>
  </section>
  <section id="currentQuestionnaire">
    
  </section>
</template>