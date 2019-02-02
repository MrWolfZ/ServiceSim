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
import { registerHandlers } from './application/register-handlers';
import { CONFIG } from './infrastructure/config';
import { App } from './ui';

import 'core-js/fn/array/flat-map';
import { registerCommandInterceptor, registerQueryInterceptor } from './infrastructure/bus';

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

axios.defaults.baseURL = CONFIG.uiApiBaseUrl;
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

registerHandlers();

registerCommandInterceptor(async command => {
  const response = await axios.post<NonNullable<typeof command['@return']>>(`/command`, command);
  return response.data;
});

registerQueryInterceptor(async query => {
  const response = await axios.post<NonNullable<typeof query['@return']>>(`/query`, query);
  return response.data;
});

new Vue({
  router: new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
      {
        path: '/predicate-tree',
        name: 'predicate-tree',
        component: () => import(/* webpackChunkName: "predicate-tree" */ './modules/development/predicate-tree/predicate-tree'),
      },
      {
        path: '/predicate-templates',
        name: 'predicate-templates',
        component: () => import(/* webpackChunkName: "predicate-template" */ './modules/development/predicate-template/predicate-templates'),
      },
      {
        path: '/predicate-templates/:id',
        name: 'predicate-template',
        component: () => import(/* webpackChunkName: "predicate-template" */ './modules/development/predicate-template/predicate-template'),
      },
      {
        path: '/response-generator-templates',
        name: 'response-generator-templates',
        component: () => import(/* webpackChunkName: "response-generator-template" */ './modules/development/predicate-template/predicate-templates'),
      },
      {
        path: '/admin',
        name: 'admin',
        component: () => import(/* webpackChunkName: "admin" */ './modules/admin/admin'),
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
