// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueRouter from 'vue-router';
import VueLocalStorage from 'vue-localstorage';
import Icon from 'vue-svg-icon/Icon.vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import {State, Mutations} from './stores/state';
import App from './App.vue';
import Home from './components/Home.vue';
import User from './components/User.vue';
import Playlist from './components/Playlist.vue';

Vue.use(VueRouter);
Vue.use(VueLocalStorage);
Vue.use(Vuex);

Vue.component('icon', Icon);
Icon.inject('star');

const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', component: Home },
    { path: '/user', component: User },
    { path: '/playlist/:user/:id', component: Playlist },
    { path: '*', redirect: '/' },
  ],
});

const store = new Vuex.Store({
  state: State,
  mutations: Mutations,
  plugins: [createPersistedState({
    paths: ['discogsAlbumsData']
  })],
});
// const store = new Vuex.Store(State);


// Create and mount the root instance.
// Make sure to inject the router with the router option to make the
// whole app router-aware.
const app = new Vue({
  router,
  store,
  el: '#app',
  render: h => h(App),
  // localStorage: { discogsStore: { type: Object, default: {} } },
});
