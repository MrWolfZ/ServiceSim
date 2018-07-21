import { InitializePredicateKindsPageAction, PredicateKindsPageActions } from './predicate-kinds.actions';
import { INITIAL_PREDICATE_KINDS_PAGE_STATE, PredicateKindsPageState } from './predicate-kinds.state';

import { callNestedReducers } from 'app/infrastructure';

import { InitializePredicateKindListAction, predicateKindListReducer } from './predicate-kind-list';

export function predicateKindsPageReducer(state = INITIAL_PREDICATE_KINDS_PAGE_STATE, action: PredicateKindsPageActions): PredicateKindsPageState {
  state = callNestedReducers(state, action, {
    predicateKindList: predicateKindListReducer,
  });

  switch (action.type) {
    case InitializePredicateKindsPageAction.TYPE:
      return {
        ...state,
        ...action.dto,
        predicateKindList: predicateKindListReducer(state.predicateKindList, new InitializePredicateKindListAction(action.dto.predicateKindList)),
      };

    default:
      return state;
  }
}
