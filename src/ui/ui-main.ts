import { CONFIG } from '../infrastructure/config';

import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faArrowLeft,
  faCheck,
  faChevronRight,
  faEdit,
  faExclamation,
  faExpand,
  faInfoCircle,
  faPlus,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import axios from 'axios';
import Vue from 'vue';
import Component from 'vue-class-component';
import Router, { RouteConfig } from 'vue-router';
import Vuex from 'vuex';
import { getStoreBuilder } from 'vuex-typex';
import { registerHandlers } from '../application/register-handlers';
import { registerCommandInterceptor, registerQueryInterceptor } from '../infrastructure/bus';
import { App } from './ui';

import 'core-js/fn/array/flat-map';
import { logger } from 'src/infrastructure/logging';
import { CONDITION_TEMPLATES_ROUTE, ENGINE_RUNTIME_ROUTE, RESPONDER_TEMPLATES_ROUTE, SERVICES_CONFIGURATION_ROUTE } from './shared/routing';

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
library.add(faExpand);

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
  try {
    const response = await axios.post<NonUndefined<typeof command['@return']>>(`/command?${command.commandType}`, command);
    return response.data;
  } catch (err) {
    logger.error(`error while executing command of type ${command.commandType}`);
    if (err.response.data && err.response.data.messages) {
      const messages = err.response.data.messages as string[];
      const stackTrace = err.response.data.stackTrace as string || '';
      for (const msg of messages) {
        logger.error(msg);
      }

      logger.error(stackTrace);

      alert(`error while executing command of type ${command.commandType}\n\n${messages.join('\n')}\n\n${stackTrace}`);
    }

    throw err;
  }
});

registerQueryInterceptor(async query => {
  try {
    const response = await axios.post<NonUndefined<typeof query['@return']>>(`/query?${query.queryType}`, query);
    return response.data;
  } catch (err) {
    logger.error(`error while executing query of type ${query.queryType}`);
    if (err.response.data && err.response.data.messages) {
      const messages = err.response.data.messages as string[];
      const stackTrace = err.response.data.stackTrace as string || '';
      for (const msg of messages) {
        logger.error(msg);
      }

      logger.error(stackTrace);

      alert(`error while executing query of type ${query.queryType}\n\n${messages.join('\n')}\n\n${stackTrace}`);
    }

    throw err;
  }
});

function createRouter() {
  return new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
      {
        path: '/engine-runtime',
        name: ENGINE_RUNTIME_ROUTE,
        component: () => import(
          /* webpackChunkName: "engine-runtime" */
          './pages/engine-runtime/engine-runtime.page'
        ),
      },
      ...prefixWith('/engine-configuration', [
        {
          path: '/services',
          name: SERVICES_CONFIGURATION_ROUTE,
          component: () => import(
            /* webpackChunkName: "engine-configuration" */
            './pages/engine-configuration/services-configuration/services-configuration.page'
          ),
        },
        {
          path: '/condition-templates',
          name: CONDITION_TEMPLATES_ROUTE,
          component: () => import(
            /* webpackChunkName: "engine-configuration" */
            './pages/engine-configuration/condition-templates/condition-templates.page'
          ),
        },
        {
          path: '/responder-templates',
          name: RESPONDER_TEMPLATES_ROUTE,
          component: () => import(
            /* webpackChunkName: "engine-configuration" */
            './pages/engine-configuration/responder-templates/responder-templates.page'
          ),
        },
      ]),
      {
        path: '/runtime',
        name: 'runtime',
        component: () => import(/* webpackChunkName: "runtime" */ './modules/predicate-tree/predicate-tree'),
      },
      ...prefixWith('/development', [
        {
          path: '/predicate-tree/:focusedNodeId?',
          name: 'predicate-tree',
          component: () => import(/* webpackChunkName: "development-predicate-tree" */ './modules/predicate-tree/predicate-tree'),
        },
        {
          path: '/predicate-node/:id',
          name: 'predicate-node',
          component: () => import(/* webpackChunkName: "development-predicate-tree" */ './modules/predicate-tree/predicate-node'),
        },
        {
          path: '/predicate-templates',
          name: 'predicate-templates',
          component: () => import(/* webpackChunkName: "development-predicate-template" */ './modules/predicate-template/predicate-templates'),
        },
        {
          path: '/predicate-templates/:id',
          name: 'predicate-template',
          component: () => import(/* webpackChunkName: "development-predicate-template" */ './modules/predicate-template/predicate-template'),
        },
        {
          path: '/response-generator-templates',
          name: 'response-generator-templates',
          component: () => import(/* webpackChunkName: "development-response-generator-template" */ './modules/predicate-template/predicate-templates'),
        },
      ]),
      {
        path: '/admin',
        name: 'admin',
        component: () => import(/* webpackChunkName: "admin" */ './modules/admin/admin'),
      },
      {
        path: '/',
        redirect: '/runtime',
      },
      {
        path: '*',
        redirect: '/',
      },
    ],
  });
}

function createAndMountApp() {
  const router = createRouter();

  const app = new Vue({
    router,
    store: getStoreBuilder<{}>().vuexStore(),
    render: (h) => h(App),
  });

  app.$mount('#app > *');
}

createAndMountApp();

function prefixWith(prefix: string, configs: RouteConfig[]): RouteConfig[] {
  return configs.map(c => ({ ...c, path: `${prefix}${c.path}` }));
}

if (module.hot) {
  module.hot.accept([
    './pages/engine-runtime/engine-runtime.page',
    './pages/engine-configuration/services-configuration/services-configuration.page',
    './pages/engine-configuration/condition-templates/condition-templates.page',
    './pages/engine-configuration/responder-templates/responder-templates.page',
  ], moduleIds => {
    logger.debug(`hot reloading modules '${moduleIds.join(', ')}'...`);
    createAndMountApp();
  });
}
