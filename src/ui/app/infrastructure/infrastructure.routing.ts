import { Routes } from '@angular/router';

import { ErrorPage } from './error-page';

export const infrastructureRoutes: Routes = [
  {
    path: 'error',
    component: ErrorPage,
  },
];
