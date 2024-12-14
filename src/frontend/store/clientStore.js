import { defineStore } from 'pinia';

export const useClientStore = defineStore('client', {
    state: () => ({
        name: '',
        song: '',
        artist: '',
    }),
    actions: {
        setClientData(name, song, artist) {
            this.name = name;
            this.song = song;
            this.artist = artist;
        },
    },
});