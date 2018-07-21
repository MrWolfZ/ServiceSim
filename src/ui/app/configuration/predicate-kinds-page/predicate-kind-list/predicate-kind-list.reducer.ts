import { InitializePredicateKindListAction, PredicateKindListActions } from './predicate-kind-list.actions';
import { INITIAL_PREDICATE_KIND_LIST_STATE, PredicateKindListState } from './predicate-kind-list.state';

import { callNestedReducers, createArrayReducer } from 'app/infrastructure';

import { InitializePredicateKindListItemAction, predicateKindListItemReducer } from './predicate-kind-list-item';

export function predicateKindListReducer(state = INITIAL_PREDICATE_KIND_LIST_STATE, action: PredicateKindListActions): PredicateKindListState {
  state = callNestedReducers(state, action, {
    items: createArrayReducer(predicateKindListItemReducer),
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

    default:
      return state;
  }
}
