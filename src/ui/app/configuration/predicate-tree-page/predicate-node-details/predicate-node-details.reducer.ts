import { InitializePredicateNodeDetailsAction, PredicateNodeDetailsActions } from './predicate-node-details.actions';
import { INITIAL_PREDICATE_NODE_DETAILS_STATE, PredicateNodeDetailsState } from './predicate-node-details.state';

export function predicateNodeDetailsReducer(state = INITIAL_PREDICATE_NODE_DETAILS_STATE, action: PredicateNodeDetailsActions): PredicateNodeDetailsState {
  switch (action.type) {
    case InitializePredicateNodeDetailsAction.TYPE:
      return {
        ...state,
        ...action.dto,
      };

    default:
      return state;
  }
}
