import { InitializePredicateTreePageAction, PredicateTreePageActions } from './predicate-tree.actions';
import { INITIAL_PREDICATE_TREE_PAGE_STATE, PredicateTreePageState } from './predicate-tree.state';

import { callNestedReducers, createArrayReducer } from 'app/infrastructure';

import { InitializePredicateNodeAction, predicateNodeReducer } from './predicate-node';

export function predicateTreePageReducer(state = INITIAL_PREDICATE_TREE_PAGE_STATE, action: PredicateTreePageActions): PredicateTreePageState {
  state = callNestedReducers(state, action, {
    topLevelNodes: createArrayReducer(predicateNodeReducer),
  });

  switch (action.type) {
    case InitializePredicateTreePageAction.TYPE:
      return {
        ...state,
        ...action.dto,
        topLevelNodes: action.dto.topLevelNodes.map((dto, idx) =>
          predicateNodeReducer(state.topLevelNodes[idx], new InitializePredicateNodeAction(dto))
        ),
      };

    default:
      return state;
  }
}
