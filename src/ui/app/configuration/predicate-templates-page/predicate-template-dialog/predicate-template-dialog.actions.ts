import { Action } from '@ngrx/store';

import { PredicateTemplateDialogFormValue } from './predicate-template-dialog.dto';

export class OpenPredicateTemplateDialogAction implements Action {
  static readonly TYPE = 'configuration/predicate-templates-page/predicate-template-dialog/OPEN';
  readonly type = OpenPredicateTemplateDialogAction.TYPE;

  constructor(
    public initialFormValue?: PredicateTemplateDialogFormValue,
    public templateId?: string,
  ) { }
}

export class SubmitPredicateTemplateDialogAction implements Action {
  static readonly TYPE = 'configuration/predicate-templates-page/predicate-template-dialog/SUBMIT';
  readonly type = SubmitPredicateTemplateDialogAction.TYPE;

  constructor(
    public formValue: PredicateTemplateDialogFormValue,
    public templateId: string | undefined,
  ) { }
}

// TODO: handle failure as well
export class PredicateTemplateDialogSubmitSuccessfulAction implements Action {
  static readonly TYPE = 'configuration/predicate-templates-page/predicate-template-dialog/SUBMIT_SUCCESSFUL';
  readonly type = PredicateTemplateDialogSubmitSuccessfulAction.TYPE;

  constructor(
    public templateId: string,
    public formValue: PredicateTemplateDialogFormValue,
  ) { }
}

export class CancelPredicateTemplateDialogAction implements Action {
  static readonly TYPE = 'configuration/predicate-templates-page/predicate-template-dialog/CANCEL';
  readonly type = CancelPredicateTemplateDialogAction.TYPE;
}

export class PredicateTemplateDialogClosedAction implements Action {
  static readonly TYPE = 'configuration/predicate-templates-page/predicate-template-dialog/DIALOG_CLOSED';
  readonly type = PredicateTemplateDialogClosedAction.TYPE;
}

export type PredicateTemplateDialogActions =
  | OpenPredicateTemplateDialogAction
  | SubmitPredicateTemplateDialogAction
  | PredicateTemplateDialogSubmitSuccessfulAction
  | CancelPredicateTemplateDialogAction
  | PredicateTemplateDialogClosedAction
  ;
