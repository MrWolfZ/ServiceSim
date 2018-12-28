import { library } from '@fortawesome/fontawesome-svg-core';
import { faArrowLeft, faCheck, faChevronRight, faEdit, faInfoCircle, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import axios from 'axios';
import Vue from 'vue';
import Component from 'vue-class-component';
import Vuex from 'vuex';
import { getStoreBuilder } from 'vuex-typex';
import App from './app.vue';
import './domain';
import router from './router';

Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteLeave',
  'beforeRouteUpdate',
]);

library.add(faArrowLeft);
library.add(faCheck);
library.add(faChevronRight);
library.add(faEdit);
library.add(faInfoCircle);
library.add(faPlus);
library.add(faTimes);

Vue.component('fa-icon', FontAwesomeIcon as any);

Vue.use(Vuex);

Vue.config.productionTip = false;

axios.defaults.baseURL = process.env.VUE_APP_UI_BASE_URL;

new Vue({
  router,
  store: getStoreBuilder<{}>().vuexStore(),
  render: (h) => h(App),
}).$mount('#app');
