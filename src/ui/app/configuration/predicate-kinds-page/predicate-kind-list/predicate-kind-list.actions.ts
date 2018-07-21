import { Action } from '@ngrx/store';

import { PredicateKindListDto } from './predicate-kind-list.dto';

export class InitializePredicateKindListAction implements Action {
  static readonly TYPE = 'configuration/predicate-kinds-page/predicate-kind-list/INITIALIZE';
  readonly type = InitializePredicateKindListAction.TYPE;

  constructor(
    public dto: PredicateKindListDto,
  ) {}
}

export type PredicateKindListActions =
  | InitializePredicateKindListAction
  ;
