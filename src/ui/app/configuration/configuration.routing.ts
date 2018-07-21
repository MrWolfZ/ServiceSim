import { Route } from '@angular/router';

import { PREDICATE_KINDS_PAGE_PATH } from 'app/shared';
import { PredicateKindsPage, PredicateKindsPageInitializationGuard } from './predicate-kinds-page';

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
];
