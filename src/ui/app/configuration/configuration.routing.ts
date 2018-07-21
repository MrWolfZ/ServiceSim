import { Route } from '@angular/router';

import { PREDICATE_KINDS_PAGE_PATH, RESPONSE_GENERATOR_KINDS_PAGE_PATH } from 'app/infrastructure';
import { PredicateKindsPage, PredicateKindsPageInitializationGuard } from './predicate-kinds-page';

import { ResponseGeneratorsPage, ResponseGeneratorsPageInitializationGuard } from './response-generators-page';

export const configurationRoutes: Route[] = [
  {
    path: '',
    redirectTo: PREDICATE_KINDS_PAGE_PATH,
    pathMatch: 'full',
  },
  {
    path: PREDICATE_KINDS_PAGE_PATH,
    component: PredicateKindsPage,
    canActivate: [PredicateKindsPageInitializationGuard],
  },
  {
    path: RESPONSE_GENERATOR_KINDS_PAGE_PATH,
    component: ResponseGeneratorsPage,
    canActivate: [ResponseGeneratorsPageInitializationGuard],
  },
];
