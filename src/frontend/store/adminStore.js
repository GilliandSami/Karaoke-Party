import { defineStore } from 'pinia';

export const useAdminStore = defineStore('admin', {
    state: () => ({
        participants: [], // Liste des participants
        selectedParticipant: null, // Participant sélectionné par la roue
    }),
    actions: {
        addParticipant(participant) {
            this.participants.push(participant);
        },
        removeSelectedParticipant() {
            if (this.selectedParticipant) {
                this.participants = this.participants.filter(
                    (p) => p.name !== this.selectedParticipant.name
                );
                this.selectedParticipant = null;
            }
        },
        selectParticipant(participant) {
            this.selectedParticipant = participant;
        },
    },
});
