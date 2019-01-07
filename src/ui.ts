import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faArrowLeft,
  faCheck,
  faChevronRight,
  faEdit,
  faExclamation,
  faInfoCircle,
  faPlus,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
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

import 'core-js/fn/array/flat-map';

/** IE9, IE10 and IE11 requires all of the following polyfills. **/
// import 'core-js/es6/symbol';
// import 'core-js/es6/object';
// import 'core-js/es6/function';
// import 'core-js/es6/parse-int';
// import 'core-js/es6/parse-float';
// import 'core-js/es6/number';
// import 'core-js/es6/math';
// import 'core-js/es6/string';
// import 'core-js/es6/date';
// import 'core-js/es6/array';
// import 'core-js/es6/regexp';
// import 'core-js/es6/map';
// import 'core-js/es6/weak-map';
// import 'core-js/es6/set';

library.add(faArrowLeft);
library.add(faCheck);
library.add(faChevronRight);
library.add(faEdit);
library.add(faInfoCircle);
library.add(faPlus);
library.add(faTimes);
library.add(faExclamation);

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
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

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
        path: '/admin',
        name: 'admin',
        component: () => import(/* webpackChunkName: "admin" */ './modules/admin/admin.vue'),
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
