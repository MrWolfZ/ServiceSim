import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';

import { HandleApiErrorAction } from './error.actions';
import { ApiError } from './error.state';

import { NavigateAction } from '../router';

export const DEFAULT_API_ERROR: ApiError = {
  message: '-',
  stackTrace: '-',
  timeOfErrorEpoch: 0,
};

enum HttpStatusCode {
  NotFound = 404,
  ServiceUnavailable = 503,
}

@Injectable()
export class ErrorEffects {

  @Effect()
  showApiError$: Observable<Action> = this.actions$.pipe(
    ofType(HandleApiErrorAction.TYPE),
    map(a => a as HandleApiErrorAction),
    flatMap((a): Action[] => {
      let apiError = a.response.body as ApiError;

      // if a connection to the server could not be established (e.g. due to invalid certificate
      // on local dev VMs) then the response contains a ProgressEvent instead of an actual response
      if (apiError instanceof ProgressEvent) {
        apiError = {
          ...DEFAULT_API_ERROR,
          message: 'Could not establish connection to the server.',
        };
      }

      // 404 errors have an empty body, so we need to set a default
      if (a.response.status === HttpStatusCode.NotFound) {
        apiError = {
          ...DEFAULT_API_ERROR,
          message: 'A resource could not be found.',
        };
      }

      // if the api error could not be read for any reason, we create a default one
      if (!apiError) {
        apiError = {
          ...DEFAULT_API_ERROR,
          message: 'An unknown error occured.',
        };
      }

      apiError = {
        ...apiError,
        timeOfErrorEpoch: Date.now(),
      };

      return [
        new NavigateAction(['infrastructure', 'error'], { apiError: JSON.stringify(apiError) }),
      ];
    }),
  );

  constructor(
    private actions$: Actions,
  ) { }
}
