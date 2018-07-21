import { Routes } from '@angular/router';

import { AppGuard } from './app.guard';
import {
  CONFIGURATION_MODULE_PATH,
  INFRASTRUCTURE_MODULE_PATH,
} from './shared';

export const routes: Routes = [
  {
    path: '',
    canActivate: [AppGuard],
    runGuardsAndResolvers: 'always',
    children: [
      {
        path: INFRASTRUCTURE_MODULE_PATH,
        loadChildren: './infrastructure/infrastructure.module#InfrastructureModule',
      },
      {
        path: CONFIGURATION_MODULE_PATH,
        loadChildren: './configuration/configuration.module#ConfigurationModule',
      },
      {
        path: '**',
        redirectTo: CONFIGURATION_MODULE_PATH,
      },
    ],
  },
];
