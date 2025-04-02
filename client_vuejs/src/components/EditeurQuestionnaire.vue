<script>
export default {
  props: {
    questionnaire: Object,
    questions: Array
  },
  data() {
    return {
      have_new_question: false,
      titreQuestionnaire: "" // Initialisation correcte
    };
  },
  methods: {
    async saveNewQuestionnaire() {
      if (!this.titreQuestionnaire.trim()) {
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

    newQuestionnaire() {
      this.titreQuestionnaire = ""; // Réinitialisation du titre
      this.$emit('set_id_current_questionnaire', null);
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

    newQuestion() {
      if (!this.have_new_question) {
        this.have_new_question = true;
      }
    },

    editQuestionnaire() {
      this.$emit('editQuestionnaire', this.questionnaire.id, this.titreQuestionnaire);
    }
  },
  watch: {
    questionnaire: {
      handler(newquestionnaire) {
        if (newquestionnaire) {
          this.have_new_question = false;
          this.titreQuestionnaire = newquestionnaire.name || "";
        }
      },
      immediate: true
    }
  }
};
</script>


<template>
  <h2>Éditeur de Questionnaires</h2>
  <section id="tools">
    <img id="add" src="/img/new.png" alt="Nouveau questionnaire" @click="newQuestionnaire" />
    <img v-if="questionnaire" id="save" src="/img/save.png" alt="save questionnaire" @click="editQuestionnaire" />
    <img v-else id="save" src="/img/save.png" alt="save questionnaire" @click="saveNewQuestionnaire" />
    <img v-if="questionnaire" id="del" src="/img/delete.png" alt="delete questionnaire" @click="deleteQuestionnaire" />
  </section>
  <section>
    <div v-if="questionnaire">
      <h1>
        Titre:
        <input v-model="titreQuestionnaire" type="text"/>
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
            <img id="save" src="/img/save.png" alt="save questionnaire" @click="" />
            <img v-if="questionnaire" id="del" src="/img/delete.png" alt="delete questionnaire" @click="" />
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