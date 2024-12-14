import { defineStore } from 'pinia';

export const useParticipantStore = defineStore('participant', {
    state: () => ({
        participants: [],
    }),
    actions: {
        addParticipant(participant) {
            this.participants.push(participant);
        },
    },
});
