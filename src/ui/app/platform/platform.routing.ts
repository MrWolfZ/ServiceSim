import { Routes } from '@angular/router';

import { ErrorPage } from './error-page';

export const platformRoutes: Routes = [
  {
    path: 'error',
    component: ErrorPage,
  },
];
