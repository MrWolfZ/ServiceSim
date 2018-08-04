import { InitializePredicateTemplatesPageAction } from './predicate-templates.actions';
import { PredicateTemplatesPageDto } from './predicate-templates.dto';
import { predicateTemplatesPageReducer } from './predicate-templates.reducer';
import { INITIAL_PREDICATE_TEMPLATES_PAGE_STATE } from './predicate-templates.state';

import { MOCK_PREDICATE_TEMPLATE_TILE_DTO } from './predicate-template-tile/predicate-template-tile.reducer.spec';

export const MOCK_PREDICATE_TEMPLATES_PAGE_DTO: PredicateTemplatesPageDto = {
  tiles: [MOCK_PREDICATE_TEMPLATE_TILE_DTO],
};

describe(predicateTemplatesPageReducer.name, () => {
  it('should return the initial state when called with undefined state', () => {
    expect(predicateTemplatesPageReducer(undefined, { type: 'INIT' } as any)).toBeDefined();
  });

  it('should return the modified state when called with initialization action', () => {
    const initializedState = predicateTemplatesPageReducer(
      INITIAL_PREDICATE_TEMPLATES_PAGE_STATE,
      new InitializePredicateTemplatesPageAction(MOCK_PREDICATE_TEMPLATES_PAGE_DTO),
    );

    expect(initializedState).not.toBe(INITIAL_PREDICATE_TEMPLATES_PAGE_STATE);
  });
});
