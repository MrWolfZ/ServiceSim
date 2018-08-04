import { InitializePredicateTemplateTileAction } from './predicate-template-tile.actions';
import { PredicateTemplateTileDto } from './predicate-template-tile.dto';
import { predicateTemplateTileReducer } from './predicate-template-tile.reducer';
import { INITIAL_PREDICATE_TEMPLATE_TILE_STATE } from './predicate-template-tile.state';

export const MOCK_PREDICATE_TEMPLATE_TILE_DTO: PredicateTemplateTileDto = {
  templateId: '',
  name: '',
  description: '',
  evalFunctionBody: '',
  parameters: [],
};

describe(predicateTemplateTileReducer.name, () => {
  it('should return the initial state when called with undefined state', () => {
    expect(predicateTemplateTileReducer(undefined, { type: 'INIT' } as any)).toBeDefined();
  });

  it('should return the modified state when called with initialization action', () => {
    const initializedState = predicateTemplateTileReducer(
      INITIAL_PREDICATE_TEMPLATE_TILE_STATE,
      new InitializePredicateTemplateTileAction(MOCK_PREDICATE_TEMPLATE_TILE_DTO),
    );

    expect(initializedState).not.toBe(INITIAL_PREDICATE_TEMPLATE_TILE_STATE);
  });
});
