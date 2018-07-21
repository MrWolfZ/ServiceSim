import { CommonModule, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { InjectionToken, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faEdit, faTimes } from '@fortawesome/free-solid-svg-icons';
import { EffectsModule } from '@ngrx/effects';
import { NgrxFormsModule } from 'ngrx-forms';
import { SchedulerLike } from 'rxjs';

import { InfrastructureEffects } from './infrastructure.effects';
import { infrastructureRoutes } from './infrastructure.routing';

import { ExpansionContainerComponent } from './components';
import { ErrorEffects, ErrorPage } from './error-page';
import { LoadingBarComponent } from './loading-bar';
import { RouterEffects, TrackRouteIsActiveDirective } from './router';

import {
  PredicateKindsLinkDirective,
  ResponseGeneratorKindsLinkDirective,
  RoutingEffects,
} from './routing';

export const RXJS_SCHEDULER = new InjectionToken<SchedulerLike | undefined>('rxjs/Scheduler');

library.add(faEdit);
library.add(faTimes);

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    NgrxFormsModule,
    FontAwesomeModule,
    RouterModule.forChild(infrastructureRoutes),
    EffectsModule.forFeature([
      InfrastructureEffects,
      RouterEffects,
      ErrorEffects,
      RoutingEffects,
    ]),
  ],
  declarations: [
    ErrorPage,
    LoadingBarComponent,
    ExpansionContainerComponent,
    TrackRouteIsActiveDirective,
    PredicateKindsLinkDirective,
    ResponseGeneratorKindsLinkDirective,
  ],
  exports: [
    CommonModule,
    HttpClientModule,
    NgrxFormsModule,
    FontAwesomeModule,
    LoadingBarComponent,
    ExpansionContainerComponent,
    TrackRouteIsActiveDirective,
    PredicateKindsLinkDirective,
    ResponseGeneratorKindsLinkDirective,
  ],
  providers: [
    { provide: RXJS_SCHEDULER, useValue: undefined },
    // for some reason the location strategy defined by the router is not visible
    // inside this module, so we have to provide it ourselves
    { provide: LocationStrategy, useClass: HashLocationStrategy },
  ],
})
export class InfrastructureModule { }
