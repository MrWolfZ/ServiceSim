import { InitializePredicateTemplatesPageAction, PredicateTemplatesPageActions } from './predicate-templates.actions';
import { INITIAL_PREDICATE_TEMPLATES_PAGE_STATE, PredicateTemplatesPageState } from './predicate-templates.state';

import { callNestedReducers, createArrayReducer } from 'app/infrastructure';

import { predicateTemplateDialogReducer, PredicateTemplateDialogSubmitSuccessfulAction } from './predicate-template-dialog';
import { DeletePredicateTemplateAction, InitializePredicateTemplateTileAction, predicateTemplateTileReducer } from './predicate-template-tile';

export function predicateTemplatesPageReducer(
  state = INITIAL_PREDICATE_TEMPLATES_PAGE_STATE,
  action: PredicateTemplatesPageActions | PredicateTemplateDialogSubmitSuccessfulAction | DeletePredicateTemplateAction,
): PredicateTemplatesPageState {
  state = callNestedReducers(state, action, {
    tiles: createArrayReducer(predicateTemplateTileReducer),
    dialog: predicateTemplateDialogReducer,
  });

  switch (action.type) {
    case InitializePredicateTemplatesPageAction.TYPE:
      return {
        ...state,
        ...action.dto,
        tiles: action.dto.tiles.map(dto =>
          predicateTemplateTileReducer(
            state.tiles.find(t => t.templateId === dto.templateId),
            new InitializePredicateTemplateTileAction(dto)),
        ),
      };

    case PredicateTemplateDialogSubmitSuccessfulAction.TYPE: {
      const newTile = predicateTemplateTileReducer(
        undefined,
        new InitializePredicateTemplateTileAction({
          templateId: action.templateId,
          name: action.formValue.name,
          description: action.formValue.description,
          evalFunctionBody: action.formValue.evalFunctionBody,
          parameters: action.formValue.parameters,
        }),
      );

      const tiles = [
        ...state.tiles.filter(t => t.templateId !== action.templateId),
        newTile,
      ].sort((l, r) => l.name.localeCompare(r.name));

      return {
        ...state,
        tiles,
      };
    }

    case DeletePredicateTemplateAction.TYPE: {
      const tiles = state.tiles.filter(i => i.templateId !== action.templateId);

      return {
        ...state,
        tiles,
      };
    }

    default:
      return state;
  }
}
