import VueRouter from 'vue-router';
// @ts-ignore
import home from './pages/home.vue';

const pages = {
    home
};

export default new VueRouter({
    mode: 'history',
    routes: [{
        path: '/',
        name: 'home',
        component: pages.home
    }]
});
