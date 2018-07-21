import { InitializePredicateKindsPageAction, PredicateKindsPageActions } from './predicate-kinds.actions';
import { INITIAL_PREDICATE_KINDS_PAGE_STATE, PredicateKindsPageState } from './predicate-kinds.state';

export function predicateKindsPageReducer(state = INITIAL_PREDICATE_KINDS_PAGE_STATE, action: PredicateKindsPageActions): PredicateKindsPageState {
  switch (action.type) {
    case InitializePredicateKindsPageAction.TYPE:
      return {
        ...state,
        ...action.dto,
      };

    default:
      return state;
  }
}
