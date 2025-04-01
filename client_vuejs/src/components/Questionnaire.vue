<script>
export default {
  props: {
    questionnaire: Object
  },
  emits: ['set_id_current_questionnaire'], // Déclare les événements émis
  methods: {
    formQuestionnaire(){
      
    }
  }
};
</script>

<template>
  <p class="form-control" @click="formQuestionnaire">
    {{ questionnaire.name }}
  </p>
</template>
