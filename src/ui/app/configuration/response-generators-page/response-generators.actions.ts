import { Action } from '@ngrx/store';

import { ResponseGeneratorsPageDto } from './response-generators.state';

export class LoadResponseGeneratorsPageDataAction implements Action {
  static readonly TYPE = 'configuration/response-generators-page/LOAD_DATA';
  readonly type = LoadResponseGeneratorsPageDataAction.TYPE;
}

export class InitializeResponseGeneratorsPageAction implements Action {
  static readonly TYPE = 'configuration/response-generators-page/INITIALIZE';
  readonly type = InitializeResponseGeneratorsPageAction.TYPE;

  constructor(
    public dto: ResponseGeneratorsPageDto,
  ) {}
}

export type ResponseGeneratorsPageActions =
  | LoadResponseGeneratorsPageDataAction
  | InitializeResponseGeneratorsPageAction
  ;
