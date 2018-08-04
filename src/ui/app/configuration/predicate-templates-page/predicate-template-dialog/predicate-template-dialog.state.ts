import { createFormGroupState, FormGroupState } from 'ngrx-forms';
import { PredicateTemplateDialogFormValue } from './predicate-template-dialog.dto';

export interface PredicateTemplateDialogState {
  templateId: string | undefined;
  dialogIsOpen: boolean;
  dialogIsClosing: boolean;
  isNewItem: boolean;
  isSaving: boolean;
  formState: FormGroupState<PredicateTemplateDialogFormValue>;
}

export const PREDICATE_TEMPLATE_DIALOG_FORM_ID = 'configuration/predicate-templates-page/predicate-template-dialog/FORM';

export const INITIAL_PREDICATE_TEMPLATE_DIALOG_FORM_STATE = createFormGroupState<PredicateTemplateDialogFormValue>(
  PREDICATE_TEMPLATE_DIALOG_FORM_ID,
  {
    name: '',
    description: '',
    evalFunctionBody: '',
    parameters: [],
  },
);

export const INITIAL_PREDICATE_TEMPLATE_DIALOG_STATE: PredicateTemplateDialogState = {
  templateId: undefined,
  dialogIsOpen: false,
  dialogIsClosing: false,
  isNewItem: false,
  isSaving: false,
  formState: INITIAL_PREDICATE_TEMPLATE_DIALOG_FORM_STATE,
};
