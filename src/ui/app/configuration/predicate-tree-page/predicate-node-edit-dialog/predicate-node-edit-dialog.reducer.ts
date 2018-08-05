import { createFormGroupState, disable, formGroupReducer, setUserDefinedProperty } from 'ngrx-forms';

import { callNestedReducers } from 'app/infrastructure';

import { isPredicateCustomProperties } from '../domain';
import { PredicateNodeEditDialogFormValue } from '../domain/predicate-node/predicate-node.dto';
import {
  CancelPredicateNodeEditDialogAction,
  OpenPredicateNodeEditDialogAction,
  PredicateNodeEditDialogActions,
  PredicateNodeEditDialogClosedAction,
  PredicateNodeEditDialogSubmitSuccessfulAction,
  SubmitPredicateNodeEditDialogAction,
} from './predicate-node-edit-dialog.actions';
import { INITIAL_PREDICATE_NODE_EDIT_DIALOG_STATE, PREDICATE_NODE_EDIT_DIALOG_FORM_ID, PredicateNodeEditDialogState } from './predicate-node-edit-dialog.state';

// TODO: properly define
export function validatePredicateNodeEditDialog<T>(t: T): T {
  return t;
}

export function predicateNodeEditDialogReducer(
  state = INITIAL_PREDICATE_NODE_EDIT_DIALOG_STATE,
  action: PredicateNodeEditDialogActions,
): PredicateNodeEditDialogState {
  state = callNestedReducers<PredicateNodeEditDialogState>(state, action, {
    formState: (s, a) => validatePredicateNodeEditDialog(formGroupReducer(s, a)),
  });

  switch (action.type) {
    case OpenPredicateNodeEditDialogAction.TYPE:
      const parameters =
        isPredicateCustomProperties(action.node.templateInfoOrCustomProperties)
          ? []
          : action.node.templateInfoOrCustomProperties.templateSnapshot.parameters;

      const evalFunctionBody =
        isPredicateCustomProperties(action.node.templateInfoOrCustomProperties)
          ? action.node.templateInfoOrCustomProperties.evalFunctionBody
          : '';

      const parameterValues =
        isPredicateCustomProperties(action.node.templateInfoOrCustomProperties)
          ? {}
          : action.node.templateInfoOrCustomProperties.parameterValues;

      return {
        ...INITIAL_PREDICATE_NODE_EDIT_DIALOG_STATE,
        node: action.node,
        parameters,
        nodeIsCustom: isPredicateCustomProperties(action.node.templateInfoOrCustomProperties),
        dialogIsOpen: true,
        formState: validatePredicateNodeEditDialog(
          createFormGroupState<PredicateNodeEditDialogFormValue>(
            PREDICATE_NODE_EDIT_DIALOG_FORM_ID,
            {
              nodeName: action.node.name,
              nodeDescription: action.node.description,
              evalFunctionBody,
              parameterValues,
            },
          )
        ),
      };

    case SubmitPredicateNodeEditDialogAction.TYPE:
      return {
        ...state,
        isSaving: true,
        formState: setUserDefinedProperty(disable(state.formState), 'isSaving', true),
      };

    case PredicateNodeEditDialogSubmitSuccessfulAction.TYPE: {
      return {
        ...state,
        dialogIsClosing: true,
      };
    }

    case CancelPredicateNodeEditDialogAction.TYPE:
      return {
        ...state,
        dialogIsClosing: true,
      };

    case PredicateNodeEditDialogClosedAction.TYPE:
      return {
        ...state,
        dialogIsOpen: false,
        dialogIsClosing: false,
      };

    default:
      return state;
  }
}
