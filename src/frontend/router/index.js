import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    {
        // path: '/',
        // name: 'Client',
        // component: () => import('../views/ClientView.vue'),
    },
    {
        // path: '/admin',
        // name: 'Admin',
        // component: () => import('../views/AdminView.vue'),
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;