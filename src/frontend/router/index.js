import { createRouter, createWebHistory } from 'vue-router';
import ClientView from '../views/ClientView.vue';
import AdminView from '../views/AdminView.vue';

const routes = [
    {
        path: '/',
        name: 'Client',
        component: ClientView,
    },
    {
        path: '/admin',
        name: 'Admin',
        component: AdminView,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;