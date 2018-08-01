import { createFormGroupState, FormGroupState } from 'ngrx-forms';
import { PredicateKindDialogFormValue } from './predicate-kind-dialog.dto';

export interface PredicateKindDialogState {
  predicateKindId: string | undefined;
  dialogIsOpen: boolean;
  dialogIsClosing: boolean;
  isNewItem: boolean;
  isSaving: boolean;
  formState: FormGroupState<PredicateKindDialogFormValue>;
}

export const PREDICATE_KIND_DIALOG_FORM_ID = 'configuration/predicate-kinds-page/predicate-kind-dialog/FORM';

export const INITIAL_PREDICATE_KIND_DIALOG_FORM_STATE = createFormGroupState<PredicateKindDialogFormValue>(
  PREDICATE_KIND_DIALOG_FORM_ID,
  {
    name: '',
    description: '',
    evalFunctionBody: '',
    parameters: [],
  },
);

export const INITIAL_PREDICATE_KIND_DIALOG_STATE: PredicateKindDialogState = {
  predicateKindId: undefined,
  dialogIsOpen: false,
  dialogIsClosing: false,
  isNewItem: false,
  isSaving: false,
  formState: INITIAL_PREDICATE_KIND_DIALOG_FORM_STATE,
};
