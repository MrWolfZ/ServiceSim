import { InitializePredicateKindTileAction } from './predicate-kind-tile.actions';
import { PredicateKindTileDto } from './predicate-kind-tile.dto';
import { predicateKindTileReducer } from './predicate-kind-tile.reducer';
import { INITIAL_PREDICATE_KIND_TILE_STATE } from './predicate-kind-tile.state';

export const MOCK_PREDICATE_KIND_TILE_DTO: PredicateKindTileDto = {
  predicateKindId: '',
  name: '',
  description: '',
  evalFunctionBody: '',
  parameters: [],
};

describe(predicateKindTileReducer.name, () => {
  it('should return the initial state when called with undefined state', () => {
    expect(predicateKindTileReducer(undefined, { type: 'INIT' } as any)).toBeDefined();
  });

  it('should return the modified state when called with initialization action', () => {
    const initializedState = predicateKindTileReducer(
      INITIAL_PREDICATE_KIND_TILE_STATE,
      new InitializePredicateKindTileAction(MOCK_PREDICATE_KIND_TILE_DTO),
    );

    expect(initializedState).not.toBe(INITIAL_PREDICATE_KIND_TILE_STATE);
  });
});
