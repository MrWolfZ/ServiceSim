import { Action } from '@ngrx/store';

import { PredicateTreePageDto } from './predicate-tree.dto';

export class LoadPredicateTreePageDataAction implements Action {
  static readonly TYPE = 'configuration/predicate-tree-page/LOAD_DATA';
  readonly type = LoadPredicateTreePageDataAction.TYPE;
}

export class InitializePredicateTreePageAction implements Action {
  static readonly TYPE = 'configuration/predicate-tree-page/INITIALIZE';
  readonly type = InitializePredicateTreePageAction.TYPE;

  constructor(
    public dto: PredicateTreePageDto,
  ) {}
}

export type PredicateTreePageActions =
  | LoadPredicateTreePageDataAction
  | InitializePredicateTreePageAction
  ;
