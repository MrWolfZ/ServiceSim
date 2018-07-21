import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { AppComponent } from './app.component';
import { AppEffects } from './app.effects';
import { metaReducers, reducers } from './app.reducer';
import { routes } from './app.routing';

import { InfrastructureModule } from './infrastructure';
import { SharedModule } from './shared';

import { environment } from '../environments/environment';
import { AppGuard } from './app.guard';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    StoreModule.forRoot(reducers, { metaReducers }),
    // Note that you must instrument after importing StoreModule
    ...environment.enableDevTools ? [StoreDevtoolsModule.instrument({ maxAge: 25 })] : [],
    RouterModule.forRoot(routes, { useHash: true }),
    EffectsModule.forRoot([AppEffects]),
    InfrastructureModule,
    SharedModule,
  ],
  bootstrap: [AppComponent],
  providers: [
    AppGuard,
  ],
})
export class AppModule { }
