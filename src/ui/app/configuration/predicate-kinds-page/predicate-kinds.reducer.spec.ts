import { InitializePredicateKindsPageAction } from './predicate-kinds.actions';
import { predicateKindsPageReducer } from './predicate-kinds.reducer';
import { INITIAL_PREDICATE_KINDS_PAGE_STATE, PredicateKindsPageDto } from './predicate-kinds.state';

export const MOCK_PREDICATE_KINDS_PAGE_DTO: PredicateKindsPageDto = {

};

describe(predicateKindsPageReducer.name, () => {
  it('should return the initial state when called with undefined state', () => {
    expect(predicateKindsPageReducer(undefined, { type: 'INIT' } as any)).toBeDefined();
  });

  it('should return the modified state when called with initialization action', () => {
    const initializedState = predicateKindsPageReducer(
      INITIAL_PREDICATE_KINDS_PAGE_STATE,
      new InitializePredicateKindsPageAction(MOCK_PREDICATE_KINDS_PAGE_DTO),
    );

    expect(initializedState).not.toBe(INITIAL_PREDICATE_KINDS_PAGE_STATE);
  });
});
