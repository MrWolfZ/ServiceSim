import { library } from '@fortawesome/fontawesome-svg-core';
import { faArrowLeft, faCheck, faChevronRight, faEdit, faInfoCircle, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Vue from 'vue';
import App from './app.vue';
import router from './router';
import store from './store';

library.add(faArrowLeft);
library.add(faCheck);
library.add(faChevronRight);
library.add(faEdit);
library.add(faInfoCircle);
library.add(faPlus);
library.add(faTimes);

Vue.component('fa-icon', FontAwesomeIcon as any);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
