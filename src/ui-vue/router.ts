import Vue from 'vue';
import Router from 'vue-router';
import PredicateTreePage from './predicate-tree/predicate-tree.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/predicate-tree',
      name: 'predicate-tree',
      component: PredicateTreePage,
    },
    {
      path: '/predicate-templates',
      name: 'predicate-templates',
      component: () => import(/* webpackChunkName: "predicate-templates" */ './predicate-templates/predicate-templates.vue'),
    },
    {
      path: '/',
      redirect: 'predicate-tree',
    },
  ],
});
