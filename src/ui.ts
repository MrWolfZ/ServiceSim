import { library } from '@fortawesome/fontawesome-svg-core';
import { faArrowLeft, faCheck, faChevronRight, faEdit, faInfoCircle, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import axios from 'axios';
import Vue from 'vue';
import Component from 'vue-class-component';
import Router from 'vue-router';
import Vuex from 'vuex';
import { getStoreBuilder } from 'vuex-typex';
import './modules/errors/errors.store';
import './modules/predicate-template/predicate-template.store';
import './modules/predicate-tree/predicate-node.store';
import App from './ui.vue';

library.add(faArrowLeft);
library.add(faCheck);
library.add(faChevronRight);
library.add(faEdit);
library.add(faInfoCircle);
library.add(faPlus);
library.add(faTimes);

Vue.component('fa-icon', FontAwesomeIcon as any);
Vue.use(Router);

Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteLeave',
  'beforeRouteUpdate',
]);

Vue.use(Vuex);

Vue.config.productionTip = false;

axios.defaults.baseURL = process.env.VUE_APP_UI_BASE_URL;

new Vue({
  router: new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
      {
        path: '/predicate-tree',
        name: 'predicate-tree',
        component: () => import(/* webpackChunkName: "predicate-tree" */ './modules/predicate-tree/predicate-tree.vue'),
      },
      {
        path: '/predicate-templates',
        name: 'predicate-templates',
        component: () => import(/* webpackChunkName: "predicate-template" */ './modules/predicate-template/predicate-templates.vue'),
      },
      {
        path: '/',
        redirect: 'predicate-tree',
      },
    ],
  }),
  store: getStoreBuilder<{}>().vuexStore(),
  render: (h) => h(App),
}).$mount('#app');
