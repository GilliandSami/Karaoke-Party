<script>
  import { useAdminStore } from '../store/adminStore';
  import { Wheel } from 'spin-wheel';
  import WSClient from '../../websocket/WSClient.js';
  
  export default {
    name: 'AdminView',
    data() {
      return {
        wheel: null,
        showOverlay: false,
      };
    },
    computed: {
      participants() {
        return useAdminStore().participants;
      },
      selectedParticipant() {
        return useAdminStore().selectedParticipant;
      },
    },
    methods: {
        initWheel() {
            const store = useAdminStore();
            const container = document.getElementById('wheel');

            // Si une roue existe déjà, on la supprime pour en recréer une nouvelle
            if (this.wheel) {
                this.wheel.remove();
            }

            const props = {
                items: store.participants.map((p) => ({ label: p.name })), // Ajout des labels
                itemBackgroundColors: ['#f39c12', '#3498db', '#2ecc71', '#e74c3c'],
                itemLabelFont: 'Arial',
                itemLabelColors: ['#fff'], // Couleurs des labels pour qu'ils soient lisibles
                radius: 0.9, // Rayon de la roue pour qu'elle occupe l'espace
                borderWidth: 1,
                borderColor: '#000',
                pointerAngle: 0, // L'angle du pointeur
            };

            // Créer la roue avec les propriétés définies
            this.wheel = new Wheel(container, props);
            },
      async spinWheel() {
        const store = useAdminStore();
  
        // Sélection aléatoire d'un participant
        const winningIndex = Math.floor(Math.random() * store.participants.length);
        const duration = 4000; // Durée de la rotation (4 secondes)
        const easing = (n) => n * n; // Fonction d'accélération
  
        // Faire tourner la roue
        await this.wheel.spinToItem(winningIndex, duration, true, 2, 1, easing);
  
        // Mettre à jour le participant sélectionné
        store.selectParticipant(store.participants[winningIndex]);
  
        // Afficher l'overlay
        this.showOverlay = true;
  
        // Masquer l'overlay après quelques secondes et supprimer le participant
        setTimeout(() => {
          this.showOverlay = false;
          store.removeSelectedParticipant();
          this.initWheel(); // Réinitialiser la roue
        }, 3000);
      },
    },
    mounted() {
      const store = useAdminStore();
      const wsClient = new WSClient('ws://localhost:8887');
  
      // Se connecter au WebSocket
      wsClient.connect().then(() => {
        wsClient.sub('karaoke-party', (data) => {
          store.addParticipant(data);
          this.initWheel(); // Mettre à jour la roue avec les nouveaux participants
        });
      });
  
      // Initialiser la roue
      this.initWheel();
    },
  };
</script>

<template>
    <div class="admin-view">
      <h1>Gestion du Karaoké 🎶</h1>
      <div class="wheel-container">
        <div id="wheel"></div>
      </div>
      <button @click="spinWheel" :disabled="participants.length === 0" class="spin-button">
        Lancer la roue
      </button>
  
      <!-- Overlay affichant le participant sélectionné -->
      <div v-if="showOverlay" class="overlay">
        <h2>{{ selectedParticipant?.name || '' }}</h2>
        <p>{{ selectedParticipant?.song || '' }} - {{ selectedParticipant?.artist || '' }}</p>
      </div>
    </div>
</template>
  
<style scoped>
  .admin-view {
    text-align: center;
    padding: 2rem;
  }
  
  .wheel-container {
    width: 400px;
    height: 400px;
    margin: 0 auto;
    border-radius: 50%;
    overflow: hidden;
    background-color: #ecf0f1;
  }
  
  .spin-button {
    margin-top: 2rem;
    padding: 1rem 2rem;
    font-size: 1.2rem;
    background-color: #2ecc71;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .spin-button:disabled {
    background-color: #bdc3c7;
    cursor: not-allowed;
  }
  
  .spin-button:hover:not(:disabled) {
    background-color: #27ae60;
  }
  
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    z-index: 9999;
  }
  
  .overlay h2 {
    font-size: 3rem;
    margin-bottom: 1rem;
  }
  
  .overlay p {
    font-size: 1.5rem;
  }
</style>
  