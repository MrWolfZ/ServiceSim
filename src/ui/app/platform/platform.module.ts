import { CommonModule } from '@angular/common';
import { InjectionToken, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { SchedulerLike } from 'rxjs';

import { PlatformEffects } from './platform.effects';
import { platformRoutes } from './platform.routing';

import { ExpansionContainerComponent } from './components';
import { ErrorEffects, ErrorPage } from './error-page';
import { LoadingBarComponent } from './loading-bar';
import { RouterEffects, TrackRouteIsActiveDirective } from './router';

export const RXJS_SCHEDULER = new InjectionToken<SchedulerLike | undefined>('rxjs/Scheduler');

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(platformRoutes),
    EffectsModule.forFeature([PlatformEffects, RouterEffects, ErrorEffects]),
  ],
  declarations: [
    ErrorPage,
    LoadingBarComponent,
    ExpansionContainerComponent,
    TrackRouteIsActiveDirective,
  ],
  exports: [
    ExpansionContainerComponent,
    TrackRouteIsActiveDirective,
  ],
  providers: [
    { provide: RXJS_SCHEDULER, useValue: undefined },
  ],
})
export class PlatformModule { }
