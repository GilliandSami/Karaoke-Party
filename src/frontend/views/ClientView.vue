<script>
  import ClientForm from '../components/ClientForm.vue';
  
  export default {
    name: 'ClientView',
    components: {
      ClientForm,
    },
  };
</script>

<template>
    <div class="client-view">
      <h1>Inscrivez votre équipe au Karaoké 🎤</h1>
      <ClientForm />
    </div>
</template>
  
<style scoped>
  .client-view {
    text-align: center;
    padding: 2rem;
  }
  
  h1 {
    color: #2c3e50;
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }
</style>
  