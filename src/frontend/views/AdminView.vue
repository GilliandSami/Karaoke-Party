<template>
  <div class="admin-view">
    <h1>Gestion du Karaoké 🎶</h1>
    <div class="wheel-container">
      <div id="wheel"></div>
      <!-- Pointeur à droite de la roue -->
      <div class="pointer"></div>
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

      // Supprimer l'ancienne roue si elle existe
      if (this.wheel) {
        this.wheel.remove();
      }

      // Configurer la roue avec les nouvelles données
      const props = {
        items: store.participants.map((p) => ({
          label: `${p.name}\n${p.song}`, // Nom + musique sur deux lignes
        })),
        itemBackgroundColors: ['#f39c12', '#3498db', '#2ecc71', '#e74c3c'],
        itemLabelFont: 'Arial',
        itemLabelColors: ['#fff'],
        itemLabelAlign: 'center',
        itemLabelRadius: 0.6, // Positionnement du texte dans l'arc
        itemLabelRadiusMax: 0.3, // Limite de la largeur pour éviter les débordements
        pointerAngle: 90, // Ajuster pour que la roue utilise un pointeur à droite
        radius: 0.95, // La roue prend 95% de son conteneur
        borderWidth: 2,
        borderColor: '#000',
        onRest: (event) => {
          const store = useAdminStore();
          const winnerIndex = event.currentIndex;
          const winner = store.participants[winnerIndex];
          store.selectParticipant(winner);

          // Afficher l'overlay avec une durée plus longue
          this.showOverlay = true;
          setTimeout(() => {
            this.showOverlay = false;
            store.removeSelectedParticipant();
            this.initWheel();
          }, 5000); // 5 secondes
        },
      };

      this.wheel = new Wheel(container, props);
    },
    async spinWheel() {
      const store = useAdminStore();

      // Sélection aléatoire d'un participant
      const winningIndex = Math.floor(Math.random() * store.participants.length);
      const duration = 4000; // Durée de la rotation
      const easing = (n) => n * n;

      // Faire tourner la roue jusqu'à l'élément sélectionné
      this.wheel.spinToItem(winningIndex, duration, true, 3, 1, easing);
    },
  },
  mounted() {
    const store = useAdminStore();
    const wsClient = new WSClient('ws://localhost:8887');

    wsClient.connect().then(() => {
      wsClient.sub('karaoke-party', (data) => {
        store.addParticipant(data);
        this.initWheel(); // Mettre à jour la roue
      });
    });

    this.initWheel(); // Initialiser la roue au montage
  },
};
</script>

<style scoped>
.admin-view {
  text-align: center;
  padding: 2rem;
}

.wheel-container {
  position: relative;
  width: 500px;
  /* Taille de la roue */
  height: 500px;
  margin: 0 auto;
}

.pointer {
  position: absolute;
  top: 25%;
  left: 15%;
  /* À droite de la roue */
  transform: translateY(-50%) rotate(90deg);
  /* Ajuster l'angle du pointeur */
  width: 0;
  height: 0;
  border-left: 20px solid transparent;
  border-right: 20px solid transparent;
  border-bottom: 40px solid green;
  /* Triangle rouge */
  z-index: 10;
}

.spin-button {
  margin-top: 1rem;
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
