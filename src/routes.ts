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
    {
        name: 'Counter',
        path: '/counter',
        component: () => import('./components/pages/Counter.vue')
    },
    {
        name: 'Movies Review',
        path: '/movie_review',
        //@ts-ignore
        component: () => import('./components/pages/MoviesReview.vue'),
        no_menu: false
    },
    {
        name: 'Add Movies Review',
        path: '/add_movie_review',
        //@ts-ignore
        component: () => import('./components/pages/AddMoviesReview.vue'),
        no_menu: true
    },

];

export default routes;