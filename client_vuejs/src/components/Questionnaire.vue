<script>
export default {
  props: {
    questionnaire: Object
  },
  emits: ['set_id_current_questionnaire'], // Déclare les événements émis
  methods: {
    set_id_current_questionnaire() {
      console.log("test");
      this.$emit("set_id_current_questionnaire", this.questionnaire.id); // Émet l'ID
    }
  }
};
</script>

<template>
  <p class="form-control" @click="set_id_current_questionnaire">
    {{ questionnaire.name }}
  </p>
</template>
