import { createFormGroupState, disable, formGroupReducer, setUserDefinedProperty } from 'ngrx-forms';

import { callNestedReducers } from 'app/infrastructure';

import {
  CancelPredicateTemplateDialogAction,
  OpenPredicateTemplateDialogAction,
  PredicateTemplateDialogActions,
  PredicateTemplateDialogClosedAction,
  PredicateTemplateDialogSubmitSuccessfulAction,
  SubmitPredicateTemplateDialogAction,
} from './predicate-template-dialog.actions';
import { PredicateTemplateDialogFormValue } from './predicate-template-dialog.dto';
import { INITIAL_PREDICATE_TEMPLATE_DIALOG_STATE, PREDICATE_TEMPLATE_DIALOG_FORM_ID, PredicateTemplateDialogState } from './predicate-template-dialog.state';
import { validatePredicateTemplateDialog } from './predicate-template-dialog.validation';

export function predicateTemplateDialogReducer(
  state = INITIAL_PREDICATE_TEMPLATE_DIALOG_STATE,
  action: PredicateTemplateDialogActions,
): PredicateTemplateDialogState {
  state = callNestedReducers<PredicateTemplateDialogState>(state, action, {
    formState: (s, a) => validatePredicateTemplateDialog(formGroupReducer(s, a)),
  });

  switch (action.type) {
    case OpenPredicateTemplateDialogAction.TYPE:
      return {
        ...INITIAL_PREDICATE_TEMPLATE_DIALOG_STATE,
        templateId: action.templateId,
        isNewItem: !action.templateId,
        dialogIsOpen: true,
        formState: validatePredicateTemplateDialog(
          createFormGroupState<PredicateTemplateDialogFormValue>(
            PREDICATE_TEMPLATE_DIALOG_FORM_ID,
            action.initialFormValue || {
              name: '',
              description: '',
              evalFunctionBody: '',
              parameters: [],
            },
          )
        ),
      };

    case SubmitPredicateTemplateDialogAction.TYPE:
      return {
        ...state,
        isSaving: true,
        formState: setUserDefinedProperty(disable(state.formState), 'isSaving', true),
      };

    case PredicateTemplateDialogSubmitSuccessfulAction.TYPE: {
      return {
        ...state,
        dialogIsClosing: true,
      };
    }

    case CancelPredicateTemplateDialogAction.TYPE:
      return {
        ...state,
        dialogIsClosing: true,
      };

    case PredicateTemplateDialogClosedAction.TYPE:
      return {
        ...state,
        dialogIsOpen: false,
        dialogIsClosing: false,
      };

    default:
      return state;
  }
}
