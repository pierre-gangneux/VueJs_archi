<script>
  export default{
    props: {
      questionnaire : Object
    }
  }
</script>
<template>
    <p type="text" class="form-control"> {{ questionnaire.name }}</p>
</template>