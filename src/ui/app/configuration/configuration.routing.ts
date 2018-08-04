import { Route } from '@angular/router';

import { PREDICATE_TEMPLATES_PAGE_PATH, PREDICATE_TREE_PAGE_PATH, RESPONSE_GENERATOR_TEMPLATES_PAGE_PATH } from 'app/infrastructure';
import { PredicateTemplatesPage, PredicateTemplatesPageInitializationGuard } from './predicate-templates-page';
import { PredicateTreePage, PredicateTreePageInitializationGuard } from './predicate-tree-page';
import { ResponseGeneratorTemplatesPage, ResponseGeneratorTemplatesPageInitializationGuard } from './response-generator-templates-page';

export const configurationRoutes: Route[] = [
  {
    path: '',
    redirectTo: PREDICATE_TREE_PAGE_PATH,
    pathMatch: 'full',
  },
  {
    path: PREDICATE_TREE_PAGE_PATH,
    component: PredicateTreePage,
    canActivate: [PredicateTreePageInitializationGuard],
  },
  {
    path: PREDICATE_TEMPLATES_PAGE_PATH,
    component: PredicateTemplatesPage,
    canActivate: [PredicateTemplatesPageInitializationGuard],
  },
  {
    path: RESPONSE_GENERATOR_TEMPLATES_PAGE_PATH,
    component: ResponseGeneratorTemplatesPage,
    canActivate: [ResponseGeneratorTemplatesPageInitializationGuard],
  },
];
