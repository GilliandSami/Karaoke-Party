<script>
  import { useClientStore } from '../store/clientStore';
  import WSClient from '../../websocket/WSClient.js';
  
  export default {
    name: 'ClientForm',

    data() {
      return {
        name: '',
        song: '',
        artist: '',
      };
    },

    methods: {
      async submitForm() {
        const store = useClientStore();
        store.setClientData(this.name, this.song, this.artist);
  
        // Envoie des données via WebSocket
        const wsClient = new WSClient('ws://localhost:8887');
        await wsClient.connect();

        wsClient.pub('karaoke-party', {
          name: this.name,
          song: this.song,
          artist: this.artist,
        });
  
        alert('Votre inscription a été envoyée avec succès !');
        this.resetForm();
      },
      resetForm() {
        this.name = '';
        this.song = '';
        this.artist = '';
      },
    },
  };
</script>

<template>
    <form @submit.prevent="submitForm" class="form">
      <label>
        Nom de l'équipe ou du participant :
        <input type="text" v-model="name" placeholder="Votre nom d'équipe" required />
      </label>
      <label>
        Nom de la musique :
        <input type="text" v-model="song" placeholder="Titre de la musique" required />
      </label>
      <label>
        Nom de l'artiste :
        <input type="text" v-model="artist" placeholder="Artiste de la musique" required />
      </label>
      <button type="submit">Envoyer</button>
    </form>
</template>
  
<style scoped>
  /* Styles du formulaire */
  .form {
    max-width: 500px;
    margin: 0 auto;
    padding: 1.5rem;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  label {
    display: block;
    margin-bottom: 1rem;
    font-weight: bold;
    color: #555;
  }
  
  input {
    width: 100%;
    padding: 0.5rem;
    margin-top: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 1rem;
  }
  
  button {
    display: block;
    width: 100%;
    padding: 0.75rem;
    margin-top: 1rem;
    background-color: #3498db;
    color: white;
    font-size: 1.2rem;
    font-weight: bold;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  button:hover {
    background-color: #2980b9;
  }
</style>
  