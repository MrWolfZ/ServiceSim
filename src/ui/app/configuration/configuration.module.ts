import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { InfrastructureModule } from 'app/infrastructure';

import { configurationRoutes } from './configuration.routing';

import {
  PREDICATE_TEMPLATES_PAGE_STATE_FEATURE_NAME,
  PredicateTemplateDialogComponent,
  PredicateTemplateFormComponent,
  PredicateTemplatesPage,
  PredicateTemplatesPageEffects,
  PredicateTemplatesPageInitializationGuard,
  predicateTemplatesPageReducer,
  PredicateTemplateTileComponent,
} from './predicate-templates-page';

import {
  RESPONSE_GENERATOR_TEMPLATES_PAGE_STATE_FEATURE_NAME,
  ResponseGeneratorTemplatesPage,
  ResponseGeneratorTemplatesPageEffects,
  ResponseGeneratorTemplatesPageInitializationGuard,
  responseGeneratorTemplatesPageReducer,
} from './response-generator-templates-page';

import {
  PREDICATE_TREE_PAGE_STATE_FEATURE_NAME,
  PredicateNodeComponent,
  PredicateNodeDetailsComponent,
  PredicateTreePage,
  PredicateTreePageEffects,
  PredicateTreePageInitializationGuard,
  predicateTreePageReducer,
} from './predicate-tree-page';

@NgModule({
  declarations: [
    PredicateTemplatesPage,
    ResponseGeneratorTemplatesPage,
    PredicateTreePage,
    PredicateNodeComponent,
    PredicateTemplateTileComponent,
    PredicateTemplateDialogComponent,
    PredicateTemplateFormComponent,
    PredicateNodeDetailsComponent,
  ],
  imports: [
    InfrastructureModule,
    RouterModule.forChild(configurationRoutes),
    EffectsModule.forFeature([
      PredicateTemplatesPageEffects,
      ResponseGeneratorTemplatesPageEffects,
      PredicateTreePageEffects,
    ]),
    StoreModule.forFeature(PREDICATE_TEMPLATES_PAGE_STATE_FEATURE_NAME, predicateTemplatesPageReducer),
    StoreModule.forFeature(RESPONSE_GENERATOR_TEMPLATES_PAGE_STATE_FEATURE_NAME, responseGeneratorTemplatesPageReducer),
    StoreModule.forFeature(PREDICATE_TREE_PAGE_STATE_FEATURE_NAME, predicateTreePageReducer),
  ],
  providers: [
    PredicateTemplatesPageInitializationGuard,
    ResponseGeneratorTemplatesPageInitializationGuard,
    PredicateTreePageInitializationGuard,
  ],
})
export class ConfigurationModule { }
