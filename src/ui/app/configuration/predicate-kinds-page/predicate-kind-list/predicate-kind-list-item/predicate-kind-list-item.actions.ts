import { Action } from '@ngrx/store';

import { PredicateKindListItemDto, PredicateKindListItemFormValue } from './predicate-kind-list-item.dto';

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

export class AddPredicateKindParameterAction implements Action {
  static readonly TYPE = 'configuration/predicate-kinds-page/predicate-kind-list/predicate-kind-list-item/ADD_PARAMETER';
  readonly type = AddPredicateKindParameterAction.TYPE;

  constructor(
    public predicateKindId: string,
  ) {}
}

export class RemovePredicateKindParameterAction implements Action {
  static readonly TYPE = 'configuration/predicate-kinds-page/predicate-kind-list/predicate-kind-list-item/REMOVE_PARAMETER';
  readonly type = RemovePredicateKindParameterAction.TYPE;

  constructor(
    public predicateKindId: string,
    public index: number,
  ) {}
}

export class SaveEditedPredicateKindListItemAction implements Action {
  static readonly TYPE = 'configuration/predicate-kinds-page/predicate-kind-list/predicate-kind-list-item/SAVE_EDITED_PREDICATE_KIND';
  readonly type = SaveEditedPredicateKindListItemAction.TYPE;

  constructor(
    public predicateKindId: string,
    public formValue: PredicateKindListItemFormValue,
  ) {}
}

export class SavingEditedPredicateKindListItemSuccessfulAction implements Action {
  static readonly TYPE = 'configuration/predicate-kinds-page/predicate-kind-list/predicate-kind-list-item/SAVING_EDITED_PREDICATE_KIND_SUCCESSFUL';
  readonly type = SavingEditedPredicateKindListItemSuccessfulAction.TYPE;

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

export class DeletePredicateKindAction implements Action {
  static readonly TYPE = 'configuration/predicate-kinds-page/predicate-kind-list/DELETE_PREDICATE_KIND';
  readonly type = DeletePredicateKindAction.TYPE;

  constructor(
    public predicateKindId: string,
  ) {}
}

export type PredicateKindListItemActions =
  | InitializePredicateKindListItemAction
  | InitializeNewPredicateKindListItemAction
  | EditPredicateKindListItemAction
  | AddPredicateKindParameterAction
  | RemovePredicateKindParameterAction
  | SaveEditedPredicateKindListItemAction
  | SavingEditedPredicateKindListItemSuccessfulAction
  | CancelEditingPredicateKindListItemAction
  | DeletePredicateKindAction
  ;
