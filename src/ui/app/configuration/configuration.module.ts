import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { PlatformModule } from 'app/platform';
import { SharedModule } from 'app/shared';

import { configurationRoutes } from './configuration.routing';

import {
  PREDICATE_KINDS_PAGE_STATE_FEATURE_NAME,
  PredicateKindsPage,
  PredicateKindsPageEffects,
  PredicateKindsPageInitializationGuard,
  predicateKindsPageReducer,
} from './predicate-kinds-page';

@NgModule({
  declarations: [
    PredicateKindsPage,
  ],
  imports: [
    PlatformModule,
    SharedModule,
    RouterModule.forChild(configurationRoutes),
    EffectsModule.forFeature([
      PredicateKindsPageEffects,
    ]),
    StoreModule.forFeature(PREDICATE_KINDS_PAGE_STATE_FEATURE_NAME, predicateKindsPageReducer),
  ],
  providers: [
    PredicateKindsPageInitializationGuard,
  ],
})
export class ConfigurationModule { }
