import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { AppInitializedAction, LoadAppDataAction } from './app.actions';
import { HandleApiErrorAction, InitializePlatformAction } from './platform';
import {
  uiApiGet,
} from './shared';

export interface ApplicationDataDto {
  version: string;
}

@Injectable()
export class AppEffects {
  @Effect()
  loadAppData$: Observable<Action> = this.actions$.pipe(
    ofType(LoadAppDataAction.TYPE),
    flatMap(() =>
      uiApiGet<ApplicationDataDto>(
        this.http,
        'appdata',
        appData => {
          return [
            new InitializePlatformAction(appData.version),
            // this must be the last action dispatched here for the app initialization logic to work properly
            new AppInitializedAction(),
          ];
        },
        {
          showsLoadingBar: true,
          blocksUi: true,
        },
      )
    ),
    // TODO: remove once API works
    flatMap(a => a.type === HandleApiErrorAction.TYPE ? [
      new InitializePlatformAction('0.1.0'),
      // this must be the last action dispatched here for the app initialization logic to work properly
      new AppInitializedAction(),
    ] : [a]),
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
  ) { }
}
