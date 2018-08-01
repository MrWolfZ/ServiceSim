import { createFormGroupState, disable, formGroupReducer, setUserDefinedProperty } from 'ngrx-forms';

import { callNestedReducers } from 'app/infrastructure';

import {
  CancelPredicateKindDialogAction,
  OpenPredicateKindDialogAction,
  PredicateKindDialogActions,
  PredicateKindDialogClosedAction,
  PredicateKindDialogSubmitSuccessfulAction,
  SubmitPredicateKindDialogAction,
} from './predicate-kind-dialog.actions';
import { PredicateKindDialogFormValue } from './predicate-kind-dialog.dto';
import { INITIAL_PREDICATE_KIND_DIALOG_STATE, PREDICATE_KIND_DIALOG_FORM_ID, PredicateKindDialogState } from './predicate-kind-dialog.state';
import { validatePredicateKindDialog } from './predicate-kind-dialog.validation';

export function predicateKindDialogReducer(state = INITIAL_PREDICATE_KIND_DIALOG_STATE, action: PredicateKindDialogActions): PredicateKindDialogState {
  state = callNestedReducers<PredicateKindDialogState>(state, action, {
    formState: (s, a) => validatePredicateKindDialog(formGroupReducer(s, a)),
  });

  switch (action.type) {
    case OpenPredicateKindDialogAction.TYPE:
      return {
        ...INITIAL_PREDICATE_KIND_DIALOG_STATE,
        predicateKindId: action.predicateKindId,
        isNewItem: !action.predicateKindId,
        dialogIsOpen: true,
        formState: validatePredicateKindDialog(
          createFormGroupState<PredicateKindDialogFormValue>(
            PREDICATE_KIND_DIALOG_FORM_ID,
            action.initialFormValue || {
              name: '',
              description: '',
              evalFunctionBody: '',
              parameters: [],
            },
          )
        ),
      };

    case SubmitPredicateKindDialogAction.TYPE:
      return {
        ...state,
        isSaving: true,
        formState: setUserDefinedProperty(disable(state.formState), 'isSaving', true),
      };

    case PredicateKindDialogSubmitSuccessfulAction.TYPE: {
      return {
        ...state,
        dialogIsClosing: true,
      };
    }

    case CancelPredicateKindDialogAction.TYPE:
      return {
        ...state,
        dialogIsClosing: true,
      };

    case PredicateKindDialogClosedAction.TYPE:
      return {
        ...state,
        dialogIsOpen: false,
        dialogIsClosing: false,
      };

    default:
      return state;
  }
}
