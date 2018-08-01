import { Action } from '@ngrx/store';

import { PredicateKindDialogFormValue } from './predicate-kind-dialog.dto';

export class OpenPredicateKindDialogAction implements Action {
  static readonly TYPE = 'configuration/predicate-kinds-page/predicate-kind-dialog/OPEN';
  readonly type = OpenPredicateKindDialogAction.TYPE;

  constructor(
    public initialFormValue?: PredicateKindDialogFormValue,
    public predicateKindId?: string,
  ) { }
}

export class SubmitPredicateKindDialogAction implements Action {
  static readonly TYPE = 'configuration/predicate-kinds-page/predicate-kind-dialog/SUBMIT';
  readonly type = SubmitPredicateKindDialogAction.TYPE;

  constructor(
    public formValue: PredicateKindDialogFormValue,
    public predicateKindId: string | undefined,
  ) { }
}

// TODO: handle failure as well
export class PredicateKindDialogSubmitSuccessfulAction implements Action {
  static readonly TYPE = 'configuration/predicate-kinds-page/predicate-kind-list/SUBMIT_SUCCESSFUL';
  readonly type = PredicateKindDialogSubmitSuccessfulAction.TYPE;

  constructor(
    public predicateKindId: string,
    public formValue: PredicateKindDialogFormValue,
  ) { }
}

export class CancelPredicateKindDialogAction implements Action {
  static readonly TYPE = 'configuration/predicate-kinds-page/predicate-kind-dialog/CANCEL';
  readonly type = CancelPredicateKindDialogAction.TYPE;
}

export class PredicateKindDialogClosedAction implements Action {
  static readonly TYPE = 'configuration/predicate-kinds-page/predicate-kind-dialog/DIALOG_CLOSED';
  readonly type = PredicateKindDialogClosedAction.TYPE;
}

export type PredicateKindDialogActions =
  | OpenPredicateKindDialogAction
  | SubmitPredicateKindDialogAction
  | PredicateKindDialogSubmitSuccessfulAction
  | CancelPredicateKindDialogAction
  | PredicateKindDialogClosedAction
  ;
