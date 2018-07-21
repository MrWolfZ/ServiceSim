import { Action } from '@ngrx/store';

import { PredicateKindListItemDto } from './predicate-kind-list-item.dto';

export class InitializePredicateKindListItemAction implements Action {
  static readonly TYPE = 'configuration/predicate-kinds-page/predicate-kind-list/predicate-kind-list-item/INITIALIZE';
  readonly type = InitializePredicateKindListItemAction.TYPE;

  constructor(
    public dto: PredicateKindListItemDto,
  ) {}
}

export type PredicateKindListItemActions =
  | InitializePredicateKindListItemAction
  ;
