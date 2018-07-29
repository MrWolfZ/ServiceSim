import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { InfrastructureModule } from 'app/infrastructure';

import { configurationRoutes } from './configuration.routing';

import {
  PREDICATE_KINDS_PAGE_STATE_FEATURE_NAME,
  PredicateKindListComponent,
  PredicateKindListItemComponent,
  PredicateKindParameterComponent,
  PredicateKindsPage,
  PredicateKindsPageEffects,
  PredicateKindsPageInitializationGuard,
  predicateKindsPageReducer,
} from './predicate-kinds-page';

import {
  RESPONSE_GENERATORS_PAGE_STATE_FEATURE_NAME,
  ResponseGeneratorsPage,
  ResponseGeneratorsPageEffects,
  ResponseGeneratorsPageInitializationGuard,
  responseGeneratorsPageReducer,
} from './response-generators-page';

@NgModule({
  declarations: [
    PredicateKindsPage,
    ResponseGeneratorsPage,
    PredicateKindListComponent,
    PredicateKindListItemComponent,
    PredicateKindParameterComponent,
  ],
  imports: [
    InfrastructureModule,
    RouterModule.forChild(configurationRoutes),
    EffectsModule.forFeature([
      PredicateKindsPageEffects,
      ResponseGeneratorsPageEffects,
    ]),
    StoreModule.forFeature(PREDICATE_KINDS_PAGE_STATE_FEATURE_NAME, predicateKindsPageReducer),
    StoreModule.forFeature(RESPONSE_GENERATORS_PAGE_STATE_FEATURE_NAME, responseGeneratorsPageReducer),
  ],
  providers: [
    PredicateKindsPageInitializationGuard,
    ResponseGeneratorsPageInitializationGuard,
  ],
})
export class ConfigurationModule { }
