import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuex from 'vuex';

Vue.use(VueRouter);
Vue.use(Vuex);

// @ts-ignore
import app from './index.vue';
import router from './router/router';
import store from './store';
import RouterActions from './router/router_actions';

Vue.prototype.$routerActions = new RouterActions(router);

export default new Vue({
    el: '#app',
    router: router,
    store: store,
    render: h => h(app)
});
