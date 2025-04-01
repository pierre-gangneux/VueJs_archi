<script>
export default {
    props: {
        questionnaire: Object
    }
};
</script>

<template>
  <h2>Editeur de Questionnaires</h2>
  <section id="tools">
    <img id="add" src="/img/new.png" alt="Nouveau questionnaire"/>
    <p v-if="questionnaire">ID : {{ questionnaire.id }}</p>
    <p v-else>Aucun questionnaire sélectionné</p>

  </section>
  <section id="currentQuestionnaire"></section>
</template>
