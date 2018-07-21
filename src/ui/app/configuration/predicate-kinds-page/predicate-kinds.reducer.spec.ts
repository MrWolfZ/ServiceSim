import { InitializePredicateKindsPageAction } from './predicate-kinds.actions';
import { predicateKindsPageReducer } from './predicate-kinds.reducer';
import { INITIAL_PREDICATE_KINDS_PAGE_STATE, PredicateKindsPageDto } from './predicate-kinds.state';

import { MOCK_PREDICATE_KIND_LIST_DTO } from './predicate-kind-list/predicate-kind-list.reducer.spec';

export const MOCK_PREDICATE_KINDS_PAGE_DTO: PredicateKindsPageDto = {
  predicateKindList: MOCK_PREDICATE_KIND_LIST_DTO,
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
