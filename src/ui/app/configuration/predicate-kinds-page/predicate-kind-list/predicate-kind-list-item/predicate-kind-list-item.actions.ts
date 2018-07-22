import { Action } from '@ngrx/store';

import { PredicateKindListItemDto } from './predicate-kind-list-item.dto';

export class InitializePredicateKindListItemAction implements Action {
  static readonly TYPE = 'configuration/predicate-kinds-page/predicate-kind-list/predicate-kind-list-item/INITIALIZE';
  readonly type = InitializePredicateKindListItemAction.TYPE;

  constructor(
    public dto: PredicateKindListItemDto,
  ) {}
}

export class InitializeNewPredicateKindListItemAction implements Action {
  static readonly TYPE = 'configuration/predicate-kinds-page/predicate-kind-list/predicate-kind-list-item/INITIALIZE_NEW';
  readonly type = InitializeNewPredicateKindListItemAction.TYPE;
}

export class EditPredicateKindListItemAction implements Action {
  static readonly TYPE = 'configuration/predicate-kinds-page/predicate-kind-list/predicate-kind-list-item/EDIT_PREDICATE_KIND';
  readonly type = EditPredicateKindListItemAction.TYPE;

  constructor(
    public predicateKindId: string,
  ) {}
}

export class CancelEditingPredicateKindListItemAction implements Action {
  static readonly TYPE = 'configuration/predicate-kinds-page/predicate-kind-list/predicate-kind-list-item/CANCEL_EDITING_PREDICATE_KIND';
  readonly type = CancelEditingPredicateKindListItemAction.TYPE;

  constructor(
    public predicateKindId: string,
  ) {}
}

export type PredicateKindListItemActions =
  | InitializePredicateKindListItemAction
  | InitializeNewPredicateKindListItemAction
  | EditPredicateKindListItemAction
  | CancelEditingPredicateKindListItemAction
  ;
