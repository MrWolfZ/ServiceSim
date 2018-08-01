import { InitializePredicateKindTileAction, PredicateKindTileActions } from './predicate-kind-tile.actions';
import { INITIAL_PREDICATE_KIND_TILE_STATE, PredicateKindTileState } from './predicate-kind-tile.state';

export function predicateKindTileReducer(state = INITIAL_PREDICATE_KIND_TILE_STATE, action: PredicateKindTileActions): PredicateKindTileState {
  switch (action.type) {
    case InitializePredicateKindTileAction.TYPE:
      return {
        ...state,
        ...action.dto,
      };

    default:
      return state;
  }
}
