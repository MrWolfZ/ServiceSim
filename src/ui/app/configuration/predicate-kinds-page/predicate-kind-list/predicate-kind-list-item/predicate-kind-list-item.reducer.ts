import { createFormGroupState, formGroupReducer } from 'ngrx-forms';

import { callNestedReducers, deepEquals } from 'app/infrastructure';

import {
  CancelEditingPredicateKindListItemAction,
  DeletePredicateKindAction,
  EditPredicateKindListItemAction,
  InitializeNewPredicateKindListItemAction,
  InitializePredicateKindListItemAction,
  PredicateKindListItemActions,
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

export function predicateKindListItemReducer(
  state = INITIAL_PREDICATE_KIND_LIST_ITEM_STATE,
  action: PredicateKindListItemActions,
): PredicateKindListItemState {
  state = callNestedReducers<PredicateKindListItemState>(state, action, {
    formState: (s, a) => validatePredicateKindListItem(formGroupReducer(s, a)),
  });

  const isChanged = !deepEquals<PredicateKindListItemFormValue>(state.formState.value, {
    name: state.name,
    description: state.description,
    evalFunctionBody: state.evalFunctionBody,
  });

  if (isChanged !== state.isChanged) {
    state = {
      ...state,
      isChanged,
    };
  }

  switch (action.type) {
    case InitializePredicateKindListItemAction.TYPE:
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
            },
          )
        ),
      };

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
            },
          )
        ),
      };

    case EditPredicateKindListItemAction.TYPE:
      if (action.predicateKindId !== state.predicateKindId) {
        return state;
      }

      return {
        ...state,
        isEditing: true,
        isReadOnly: false,
      };

    case SaveEditedPredicateKindListItemAction.TYPE:
      if (action.predicateKindId !== state.predicateKindId) {
        return state;
      }

      return {
        ...state,
        isSaving: true,
        isReadOnly: true,
      };

    case SavingEditedPredicateKindListItemSuccessfulAction.TYPE:
      if (action.predicateKindId !== state.predicateKindId) {
        return state;
      }

      return {
        ...state,
        isSaving: false,
        isEditing: false,
        ...state.formState.value,
      };

    case CancelEditingPredicateKindListItemAction.TYPE:
      if (action.predicateKindId !== state.predicateKindId) {
        return state;
      }

      return {
        ...state,
        isEditing: false,
        isReadOnly: true,
        formState: validatePredicateKindListItem(
          createFormGroupState<PredicateKindListItemFormValue>(
            `${PREDICATE_KIND_LIST_ITEM_FORM_STATE_ID_PREFIX}${state.predicateKindId}`,
            {
              name: state.name,
              description: state.description,
              evalFunctionBody: state.evalFunctionBody,
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
