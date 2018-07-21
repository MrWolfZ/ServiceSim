import { CommonModule, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { NgrxFormsModule } from 'ngrx-forms';

import {
  AppRoutingEffects,
  PredicateKindsLinkDirective,
  ResponseGeneratorKindsLinkDirective,
} from './routing';

import { InfrastructureModule } from '../infrastructure';

const exportsAndDeclarations = [
  PredicateKindsLinkDirective,
  ResponseGeneratorKindsLinkDirective,
];

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    NgrxFormsModule,
    InfrastructureModule,
    EffectsModule.forFeature([
      AppRoutingEffects,
    ]),
  ],
  declarations: exportsAndDeclarations,
  exports: [
    CommonModule,
    HttpClientModule,
    ...exportsAndDeclarations,
  ],
  providers: [
    // for some reason the location strategy defined by the router is not visible
    // inside this module, so we have to provide it ourselves
    { provide: LocationStrategy, useClass: HashLocationStrategy },
  ],
})
export class SharedModule { }
