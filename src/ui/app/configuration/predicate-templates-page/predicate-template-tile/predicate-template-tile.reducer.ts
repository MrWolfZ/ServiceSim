import { InitializePredicateTemplateTileAction, PredicateTemplateTileActions } from './predicate-template-tile.actions';
import { INITIAL_PREDICATE_TEMPLATE_TILE_STATE, PredicateTemplateTileState } from './predicate-template-tile.state';

export function predicateTemplateTileReducer(state = INITIAL_PREDICATE_TEMPLATE_TILE_STATE, action: PredicateTemplateTileActions): PredicateTemplateTileState {
  switch (action.type) {
    case InitializePredicateTemplateTileAction.TYPE:
      return {
        ...state,
        ...action.dto,
      };

    default:
      return state;
  }
}
