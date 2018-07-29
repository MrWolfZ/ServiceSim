import { InitializePredicateTreePageAction, PredicateTreePageActions } from './predicate-tree.actions';
import { INITIAL_PREDICATE_TREE_PAGE_STATE, PredicateTreePageState } from './predicate-tree.state';

export function predicateTreePageReducer(state = INITIAL_PREDICATE_TREE_PAGE_STATE, action: PredicateTreePageActions): PredicateTreePageState {
  switch (action.type) {
    case InitializePredicateTreePageAction.TYPE:
      return {
        ...state,
        ...action.dto,
      };

    default:
      return state;
  }
}
