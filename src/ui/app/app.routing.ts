import { Routes } from '@angular/router';

import { AppGuard } from './app.guard';
import {
  CONFIGURATION_MODULE_PATH,
  PLATFORM_MODULE_PATH,
} from './shared';

export const routes: Routes = [
  {
    path: '',
    canActivate: [AppGuard],
    runGuardsAndResolvers: 'always',
    children: [
      {
        path: PLATFORM_MODULE_PATH,
        loadChildren: './platform/platform.module#PlatformModule',
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
