import { InitializePredicateKindsPageAction, PredicateKindsPageActions } from './predicate-kinds.actions';
import { INITIAL_PREDICATE_KINDS_PAGE_STATE, PredicateKindsPageState } from './predicate-kinds.state';

import { callNestedReducers, createArrayReducer } from 'app/infrastructure';

import { predicateTemplateDialogReducer, PredicateTemplateDialogSubmitSuccessfulAction } from './predicate-kind-dialog';
import { DeletePredicateKindAction, InitializePredicateKindTileAction, predicateKindTileReducer } from './predicate-kind-tile';

export function predicateKindsPageReducer(
  state = INITIAL_PREDICATE_KINDS_PAGE_STATE,
  action: PredicateKindsPageActions | PredicateTemplateDialogSubmitSuccessfulAction | DeletePredicateKindAction,
): PredicateKindsPageState {
  state = callNestedReducers(state, action, {
    tiles: createArrayReducer(predicateKindTileReducer),
    dialog: predicateTemplateDialogReducer,
  });

  switch (action.type) {
    case InitializePredicateKindsPageAction.TYPE:
      return {
        ...state,
        ...action.dto,
        tiles: action.dto.tiles.map(dto =>
          predicateKindTileReducer(
            state.tiles.find(t => t.predicateKindId === dto.predicateKindId),
            new InitializePredicateKindTileAction(dto)),
        ),
      };

    case PredicateTemplateDialogSubmitSuccessfulAction.TYPE: {
      const newTile = predicateKindTileReducer(undefined, new InitializePredicateKindTileAction({
        predicateKindId: action.templateId,
        name: action.formValue.name,
        description: action.formValue.description,
        evalFunctionBody: action.formValue.evalFunctionBody,
        parameters: action.formValue.parameters,
      }));

      const tiles = [
        ...state.tiles.filter(t => t.predicateKindId !== action.templateId),
        newTile,
      ].sort((l, r) => l.name.localeCompare(r.name));

      return {
        ...state,
        tiles,
      };
    }

    case DeletePredicateKindAction.TYPE: {
      const tiles = state.tiles.filter(i => i.predicateKindId !== action.predicateKindId);

      return {
        ...state,
        tiles,
      };
    }

    default:
      return state;
  }
}
