import { InitializePredicateKindListItemAction, PredicateKindListItemActions } from './predicate-kind-list-item.actions';
import { INITIAL_PREDICATE_KIND_LIST_ITEM_STATE, PredicateKindListItemState } from './predicate-kind-list-item.state';

export function predicateKindListItemReducer(state = INITIAL_PREDICATE_KIND_LIST_ITEM_STATE, action: PredicateKindListItemActions): PredicateKindListItemState {
  switch (action.type) {
    case InitializePredicateKindListItemAction.TYPE:
      return {
        ...state,
        ...action.dto,
      };

    default:
      return state;
  }
}
