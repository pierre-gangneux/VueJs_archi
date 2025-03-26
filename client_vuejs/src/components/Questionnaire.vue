<script>
  export default{
    props: {
      questionnaire : Object
    },
    methods:{
      suppr : function() {
        this.$emit('remove', {id:this.questionnaire.id});
      },
      edit : function() {
        this.$emit('edit', {id:this.questionnaire.id, text:this.questionnaire.name})
      }
    },
    emits : ['remove', 'edit']
  }
</script>
<template>
  <link rel="stylesheet" 
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" 
    integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65"
    crossorigin="anonymous">
  <div class="checkbox">
    <label class="form-check d-flex align-items-center gap-2">
      <input type="text" v-model="questionnaire.name" class="form-control">
      <input type="button" value="Supprimer" class="btn btn-danger" @click="suppr">
      <input type="button" value="Modifier" class="btn btn-primary" @click="edit">
    </label>
  </div>
</template>