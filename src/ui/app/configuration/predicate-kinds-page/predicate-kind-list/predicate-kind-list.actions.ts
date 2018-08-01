import { Action } from '@ngrx/store';

import { PredicateKindListItemFormValue } from './predicate-kind-list-item/predicate-kind-list-item.dto';
import { PredicateKindListDto } from './predicate-kind-list.dto';

export class InitializePredicateKindListAction implements Action {
  static readonly TYPE = 'configuration/predicate-kinds-page/predicate-kind-list/INITIALIZE';
  readonly type = InitializePredicateKindListAction.TYPE;

  constructor(
    public dto: PredicateKindListDto,
  ) {}
}

export class OpenNewPredicateKindDialogAction implements Action {
  static readonly TYPE = 'configuration/predicate-kinds-page/predicate-kind-list/OPEN_NEW_PREDICATE_KIND_DIALOG';
  readonly type = OpenNewPredicateKindDialogAction.TYPE;
}

export class CancelNewPredicateKindDialogAction implements Action {
  static readonly TYPE = 'configuration/predicate-kinds-page/predicate-kind-list/CANCEL_NEW_PREDICATE_KIND_DIALOG';
  readonly type = CancelNewPredicateKindDialogAction.TYPE;
}

export class NewPredicateKindDialogClosedAction implements Action {
  static readonly TYPE = 'configuration/predicate-kinds-page/predicate-kind-list/NEW_PREDICATE_KIND_DIALOG_CLOSED';
  readonly type = NewPredicateKindDialogClosedAction.TYPE;
}

export class SubmitNewPredicateKindDialogAction implements Action {
  static readonly TYPE = 'configuration/predicate-kinds-page/predicate-kind-list/SUBMIT_NEW_PREDICATE_KIND_DIALOG';
  readonly type = SubmitNewPredicateKindDialogAction.TYPE;

  constructor(
    public formValue: PredicateKindListItemFormValue,
  ) {}
}

// TODO: handle failure as well
export class SubmitNewPredicateKindDialogSuccessfulAction implements Action {
  static readonly TYPE = 'configuration/predicate-kinds-page/predicate-kind-list/SUBMIT_NEW_PREDICATE_KIND_DIALOG_SUCCESSFUL';
  readonly type = SubmitNewPredicateKindDialogSuccessfulAction.TYPE;

  constructor(
    public predicateKindId: string,
  ) {}
}

// TODO: handle failure as well
export class DeletePredicateKindSuccessfulAction implements Action {
  static readonly TYPE = 'configuration/predicate-kinds-page/predicate-kind-list/DELETE_PREDICATE_KIND_SUCCESSFUL';
  readonly type = DeletePredicateKindSuccessfulAction.TYPE;

  constructor(
    public predicateKindId: string,
  ) {}
}

export type PredicateKindListActions =
  | InitializePredicateKindListAction
  | OpenNewPredicateKindDialogAction
  | CancelNewPredicateKindDialogAction
  | NewPredicateKindDialogClosedAction
  | SubmitNewPredicateKindDialogAction
  | SubmitNewPredicateKindDialogSuccessfulAction
  | DeletePredicateKindSuccessfulAction
  ;
