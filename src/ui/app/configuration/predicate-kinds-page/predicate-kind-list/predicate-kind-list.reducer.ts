import { disable, formControlReducer } from 'ngrx-forms';

import { callNestedReducers, createArrayReducer } from 'app/infrastructure';

import { InitializeNewPredicateKindListItemAction, InitializePredicateKindListItemAction, predicateKindListItemReducer } from './predicate-kind-list-item';
import {
  CancelNewPredicateKindDialogAction,
  DeletePredicateKindSuccessfulAction,
  InitializePredicateKindListAction,
  OpenNewPredicateKindDialogAction,
  PredicateKindListActions,
  SubmitNewPredicateKindDialogAction,
  SubmitNewPredicateKindDialogSuccessfulAction,
} from './predicate-kind-list.actions';
import { INITIAL_PREDICATE_KIND_LIST_STATE, PredicateKindListState } from './predicate-kind-list.state';

export function predicateKindListReducer(state = INITIAL_PREDICATE_KIND_LIST_STATE, action: PredicateKindListActions): PredicateKindListState {
  state = callNestedReducers(state, action, {
    items: createArrayReducer(predicateKindListItemReducer),
    newItem: predicateKindListItemReducer,
    filterControl: formControlReducer,
  });

  switch (action.type) {
    case InitializePredicateKindListAction.TYPE:
      return {
        ...state,
        ...action.dto,
        items: action.dto.items.map((dto, idx) =>
          predicateKindListItemReducer(state.items[idx], new InitializePredicateKindListItemAction(dto))
        ),
      };

    case OpenNewPredicateKindDialogAction.TYPE:
      return {
        ...state,
        newItemDialogIsOpen: true,
        newItemIsSubmitting: false,
        newItem: predicateKindListItemReducer(undefined, new InitializeNewPredicateKindListItemAction()),
      };

    case SubmitNewPredicateKindDialogAction.TYPE:
      return {
        ...state,
        newItemIsSubmitting: true,
        newItem: {
          ...state.newItem,
          formState: disable(state.newItem.formState),
        },
      };

    case SubmitNewPredicateKindDialogSuccessfulAction.TYPE: {
      const newItem = predicateKindListItemReducer(undefined, new InitializePredicateKindListItemAction({
        predicateKindId: action.predicateKindId,
        name: state.newItem.formState.value.name,
        description: state.newItem.formState.value.description,
        evalFunctionBody: state.newItem.formState.value.evalFunctionBody,
        propertyDescriptors: state.newItem.formState.value.propertyDescriptors,
      }));

      const items = [
        ...state.items,
        newItem,
      ].sort((l, r) => l.name.localeCompare(r.name));

      return {
        ...state,
        newItemDialogIsOpen: false,
        items,
      };
    }

    case CancelNewPredicateKindDialogAction.TYPE:
      return {
        ...state,
        newItemDialogIsOpen: false,
        newItem: predicateKindListItemReducer(undefined, new InitializeNewPredicateKindListItemAction()),
      };

    case DeletePredicateKindSuccessfulAction.TYPE: {
      const items = state.items.filter(i => i.predicateKindId !== action.predicateKindId);

      return {
        ...state,
        items,
      };
    }

    default:
      return state;
  }
}
