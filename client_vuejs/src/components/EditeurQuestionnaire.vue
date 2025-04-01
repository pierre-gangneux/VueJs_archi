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
        this.$emit('refresh-list');
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
    <img id="add" src="/img/new.png" alt="Nouveau questionnaire" @click="saveNewQuestionnaire" />
    <p v-if="questionnaire">ID : {{ questionnaire.id }}</p>
    <p v-else>Aucun questionnaire sélectionné</p>
  </section>
  <section id="currentQuestionnaire">
    <div class="form-questionnaire">
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
</template>