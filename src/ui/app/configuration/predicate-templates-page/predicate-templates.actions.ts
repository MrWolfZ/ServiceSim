import { Action } from '@ngrx/store';

import { PredicateTemplatesPageDto } from './predicate-templates.dto';

export class LoadPredicateTemplatesPageDataAction implements Action {
  static readonly TYPE = 'configuration/predicate-templates-page/LOAD_DATA';
  readonly type = LoadPredicateTemplatesPageDataAction.TYPE;
}

export class InitializePredicateTemplatesPageAction implements Action {
  static readonly TYPE = 'configuration/predicate-templates-page/INITIALIZE';
  readonly type = InitializePredicateTemplatesPageAction.TYPE;

  constructor(
    public dto: PredicateTemplatesPageDto,
  ) {}
}

export type PredicateTemplatesPageActions =
  | LoadPredicateTemplatesPageDataAction
  | InitializePredicateTemplatesPageAction
  ;
