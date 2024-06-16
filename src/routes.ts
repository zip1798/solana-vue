const routes = [
    {
        name: 'Home',
        path: '/',
        component: () => import('./components/pages/Home.vue')
    },
    {
        name: 'About',
        path: '/about',
        component: () => import('./components/pages/About.vue')
    },
    {
        name: 'Project',
        path: '/project',
        component: () => import('./components/pages/Project.vue')
    },

];

export default routes;