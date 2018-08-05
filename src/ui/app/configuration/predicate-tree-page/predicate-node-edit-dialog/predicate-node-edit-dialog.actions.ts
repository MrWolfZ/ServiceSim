import { Action } from '@ngrx/store';

import { PredicateNode, } from '../domain';
import { PredicateNodeEditDialogFormValue } from '../domain/predicate-node/predicate-node.dto';

export class OpenPredicateNodeEditDialogAction implements Action {
  static readonly TYPE = 'configuration/predicate-tree-page/predicate-node-edit-dialog/OPEN';
  readonly type = OpenPredicateNodeEditDialogAction.TYPE;

  constructor(
    public node: PredicateNode,
  ) { }
}

export class SubmitPredicateNodeEditDialogAction implements Action {
  static readonly TYPE = 'configuration/predicate-tree-page/predicate-node-edit-dialog/SUBMIT';
  readonly type = SubmitPredicateNodeEditDialogAction.TYPE;

  constructor(
    public formValue: PredicateNodeEditDialogFormValue,
    public nodeId: string,
  ) { }
}

// TODO: handle failure as well
export class PredicateNodeEditDialogSubmitSuccessfulAction implements Action {
  static readonly TYPE = 'configuration/predicate-tree-page/predicate-node-edit-dialog/SUBMIT_SUCCESSFUL';
  readonly type = PredicateNodeEditDialogSubmitSuccessfulAction.TYPE;

  constructor(
    public nodeId: string,
    public formValue: PredicateNodeEditDialogFormValue,
  ) { }
}

export class CancelPredicateNodeEditDialogAction implements Action {
  static readonly TYPE = 'configuration/predicate-tree-page/predicate-node-edit-dialog/CANCEL';
  readonly type = CancelPredicateNodeEditDialogAction.TYPE;
}

export class PredicateNodeEditDialogClosedAction implements Action {
  static readonly TYPE = 'configuration/predicate-tree-page/predicate-node-edit-dialog/DIALOG_CLOSED';
  readonly type = PredicateNodeEditDialogClosedAction.TYPE;
}

export type PredicateNodeEditDialogActions =
  | OpenPredicateNodeEditDialogAction
  | SubmitPredicateNodeEditDialogAction
  | PredicateNodeEditDialogSubmitSuccessfulAction
  | CancelPredicateNodeEditDialogAction
  | PredicateNodeEditDialogClosedAction
  ;
