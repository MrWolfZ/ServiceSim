import { Action } from '@ngrx/store';

import { ResponseGeneratorTemplatesPageDto } from './response-generator-templates.state';

export class LoadResponseGeneratorTemplatesPageDataAction implements Action {
  static readonly TYPE = 'configuration/response-generator-templates-page/LOAD_DATA';
  readonly type = LoadResponseGeneratorTemplatesPageDataAction.TYPE;
}

export class InitializeResponseGeneratorTemplatesPageAction implements Action {
  static readonly TYPE = 'configuration/response-generator-templates-page/INITIALIZE';
  readonly type = InitializeResponseGeneratorTemplatesPageAction.TYPE;

  constructor(
    public dto: ResponseGeneratorTemplatesPageDto,
  ) {}
}

export type ResponseGeneratorTemplatesPageActions =
  | LoadResponseGeneratorTemplatesPageDataAction
  | InitializeResponseGeneratorTemplatesPageAction
  ;
