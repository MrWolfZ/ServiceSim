import { addArrayControl, createFormGroupState, formGroupReducer, removeArrayControl, updateGroup } from 'ngrx-forms';

import { callNestedReducers, createArrayReducer } from 'app/infrastructure';

import {
  AddPredicateKindParameterAction,
  CancelEditingPredicateKindListItemAction,
  DeletePredicateKindAction,
  EditPredicateKindListItemAction,
  InitializeNewPredicateKindListItemAction,
  InitializePredicateKindListItemAction,
  PredicateKindListItemActions,
  RemovePredicateKindParameterAction,
  SaveEditedPredicateKindListItemAction,
  SavingEditedPredicateKindListItemSuccessfulAction,
} from './predicate-kind-list-item.actions';
import {
  PredicateKindListItemFormValue,
} from './predicate-kind-list-item.dto';
import {
  INITIAL_PREDICATE_KIND_LIST_ITEM_STATE,
  PREDICATE_KIND_LIST_ITEM_FORM_STATE_ID_PREFIX,
  PredicateKindListItemState,
} from './predicate-kind-list-item.state';
import { validatePredicateKindListItem } from './predicate-kind-list-item.validation';
import {
  InitializePredicateKindParameterAction,
  predicateKindParameterReducer,
  PredicateKindParameterState,
  SetIsReadOnlyAction,
} from './predicate-kind-parameter';
import { PredicateKindParameterFormValue } from './predicate-kind-parameter/predicate-kind-parameter.dto';

export function predicateKindListItemReducer(
  state = INITIAL_PREDICATE_KIND_LIST_ITEM_STATE,
  action: PredicateKindListItemActions,
): PredicateKindListItemState {
  state = callNestedReducers<PredicateKindListItemState>(state, action, {
    formState: (s, a) => validatePredicateKindListItem(formGroupReducer(s, a)),
    parameters: createArrayReducer(predicateKindParameterReducer),
  });

  switch (action.type) {
    case InitializePredicateKindListItemAction.TYPE: {
      const parameters = action.dto.parameters.map((dto, idx) =>
        predicateKindParameterReducer(state.parameters[idx], new InitializePredicateKindParameterAction(dto))
      );

      return {
        ...INITIAL_PREDICATE_KIND_LIST_ITEM_STATE,
        ...action.dto,
        formState: validatePredicateKindListItem(
          createFormGroupState<PredicateKindListItemFormValue>(
            `${PREDICATE_KIND_LIST_ITEM_FORM_STATE_ID_PREFIX}${action.dto.predicateKindId}`,
            {
              name: action.dto.name,
              description: action.dto.description,
              evalFunctionBody: action.dto.evalFunctionBody,
              parameters: action.dto.parameters,
            },
          )
        ),
        parameters,
        uneditedParameters: parameters,
      };
    }

    case InitializeNewPredicateKindListItemAction.TYPE:
      return {
        ...INITIAL_PREDICATE_KIND_LIST_ITEM_STATE,
        isEditing: true,
        isNewItem: true,
        isReadOnly: false,
        formState: validatePredicateKindListItem(
          createFormGroupState<PredicateKindListItemFormValue>(
            `${PREDICATE_KIND_LIST_ITEM_FORM_STATE_ID_PREFIX}NEW`,
            {
              name: '',
              description: '',
              evalFunctionBody: '',
              parameters: [],
            },
          )
        ),
        parameters: state.parameters.map(p => predicateKindParameterReducer(p, new SetIsReadOnlyAction(false))),
      };

    case EditPredicateKindListItemAction.TYPE:
      if (action.predicateKindId !== state.predicateKindId) {
        return state;
      }

      return {
        ...state,
        isEditing: true,
        isReadOnly: false,
        parameters: state.parameters.map(p => predicateKindParameterReducer(p, new SetIsReadOnlyAction(false))),
      };

    case AddPredicateKindParameterAction.TYPE:
      if (action.predicateKindId !== state.predicateKindId) {
        return state;
      }

      const newValue: PredicateKindParameterFormValue = {
        name: '',
        description: '',
        isRequired: true,
        valueType: 'string',
        defaultValue: '',
      };

      return {
        ...state,
        formState: updateGroup(state.formState, {
          parameters: addArrayControl<PredicateKindParameterFormValue>(newValue),
        }),
        parameters: [
          ...state.parameters,
          predicateKindParameterReducer(
            predicateKindParameterReducer(undefined, new InitializePredicateKindParameterAction(newValue)),
            new SetIsReadOnlyAction(false),
          ),
        ],
      };

    case RemovePredicateKindParameterAction.TYPE:
      if (action.predicateKindId !== state.predicateKindId) {
        return state;
      }

      return {
        ...state,
        formState: updateGroup(state.formState, {
          parameters: removeArrayControl(action.index),
        }),
        parameters: state.parameters.filter((_, idx) => idx !== action.index),
      };

    case SaveEditedPredicateKindListItemAction.TYPE:
      if (action.predicateKindId !== state.predicateKindId) {
        return state;
      }

      return {
        ...state,
        isSaving: true,
        isReadOnly: true,
        parameters: state.parameters.map(p => predicateKindParameterReducer(p, new SetIsReadOnlyAction(true))),
      };

    case SavingEditedPredicateKindListItemSuccessfulAction.TYPE: {
      if (action.predicateKindId !== state.predicateKindId) {
        return state;
      }

      const parameters: PredicateKindParameterState[] = state.formState.value.parameters.map(p => ({
        ...p,
        isReadOnly: true,
      }));

      return {
        ...state,
        isSaving: false,
        isEditing: false,
        ...state.formState.value,
        parameters,
        uneditedParameters: parameters,
      };
    }

    case CancelEditingPredicateKindListItemAction.TYPE:
      if (action.predicateKindId !== state.predicateKindId) {
        return state;
      }

      return {
        ...state,
        isEditing: false,
        isReadOnly: true,
        parameters: state.uneditedParameters.map(p => predicateKindParameterReducer(p, new SetIsReadOnlyAction(true))),
        formState: validatePredicateKindListItem(
          createFormGroupState<PredicateKindListItemFormValue>(
            `${PREDICATE_KIND_LIST_ITEM_FORM_STATE_ID_PREFIX}${state.predicateKindId}`,
            {
              name: state.name,
              description: state.description,
              evalFunctionBody: state.evalFunctionBody,
              parameters: state.uneditedParameters.map(p => ({
                name: p.name,
                description: p.description,
                isRequired: p.isRequired,
                valueType: p.valueType,
                defaultValue: p.defaultValue,
              })),
            },
          )
        ),
      };

    case DeletePredicateKindAction.TYPE:
      if (action.predicateKindId !== state.predicateKindId) {
        return state;
      }

      return {
        ...state,
        isDeleting: true,
      };

    default:
      return state;
  }
}
