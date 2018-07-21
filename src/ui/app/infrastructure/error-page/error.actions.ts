import { HttpResponse } from '@angular/common/http';
import { Action } from '@ngrx/store';

import { ApiError } from './error.state';

export class HandleApiErrorAction implements Action {
  static readonly TYPE = 'infrastructure/error-page/HANDLE_API_ERROR';
  readonly type = HandleApiErrorAction.TYPE;

  constructor(
    public response: HttpResponse<any>,
  ) { }
}

export class ClearApiErrorAction implements Action {
  static readonly TYPE = 'infrastructure/error-page/CLEAR_API_ERROR';
  readonly type = ClearApiErrorAction.TYPE;
}

export class SetApiErrorAction implements Action {
  static readonly TYPE = 'infrastructure/error-page/SET_API_ERROR';
  readonly type = SetApiErrorAction.TYPE;

  constructor(
    public apiError: ApiError,
  ) { }
}

export type ErrorPageActions =
  | HandleApiErrorAction
  | ClearApiErrorAction
  | SetApiErrorAction
  ;
