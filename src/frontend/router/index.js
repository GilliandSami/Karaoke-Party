import { createRouter, createWebHistory } from 'vue-router';
import ClientView from '../views/ClientView.vue';

const routes = [
    {
        path: '/',
        name: 'Client',
        component: ClientView,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;