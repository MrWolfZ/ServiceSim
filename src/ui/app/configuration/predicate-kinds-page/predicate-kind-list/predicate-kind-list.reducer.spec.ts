import { InitializePredicateKindListAction } from './predicate-kind-list.actions';
import { PredicateKindListDto } from './predicate-kind-list.dto';
import { predicateKindListReducer } from './predicate-kind-list.reducer';
import { INITIAL_PREDICATE_KIND_LIST_STATE } from './predicate-kind-list.state';

import { MOCK_PREDICATE_KIND_LIST_ITEM_DTO } from './predicate-kind-list-item/predicate-kind-list-item.reducer.spec';

export const MOCK_PREDICATE_KIND_LIST_DTO: PredicateKindListDto = {
  items: [MOCK_PREDICATE_KIND_LIST_ITEM_DTO],
};

describe(predicateKindListReducer.name, () => {
  it('should return the initial state when called with undefined state', () => {
    expect(predicateKindListReducer(undefined, { type: 'INIT' } as any)).toBeDefined();
  });

  it('should return the modified state when called with initialization action', () => {
    const initializedState = predicateKindListReducer(
      INITIAL_PREDICATE_KIND_LIST_STATE,
      new InitializePredicateKindListAction(MOCK_PREDICATE_KIND_LIST_DTO),
    );

    expect(initializedState).not.toBe(INITIAL_PREDICATE_KIND_LIST_STATE);
  });
});
