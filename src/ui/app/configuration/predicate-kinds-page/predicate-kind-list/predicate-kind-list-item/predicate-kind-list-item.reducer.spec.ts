import { InitializePredicateKindListItemAction } from './predicate-kind-list-item.actions';
import { PredicateKindListItemDto } from './predicate-kind-list-item.dto';
import { predicateKindListItemReducer } from './predicate-kind-list-item.reducer';
import { INITIAL_PREDICATE_KIND_LIST_ITEM_STATE } from './predicate-kind-list-item.state';

export const MOCK_PREDICATE_KIND_LIST_ITEM_DTO: PredicateKindListItemDto = {
  name: '',
  description: '',
  evalFunctionBody: '',
};

describe(predicateKindListItemReducer.name, () => {
  it('should return the initial state when called with undefined state', () => {
    expect(predicateKindListItemReducer(undefined, { type: 'INIT' } as any)).toBeDefined();
  });

  it('should return the modified state when called with initialization action', () => {
    const initializedState = predicateKindListItemReducer(
      INITIAL_PREDICATE_KIND_LIST_ITEM_STATE,
      new InitializePredicateKindListItemAction(MOCK_PREDICATE_KIND_LIST_ITEM_DTO),
    );

    expect(initializedState).not.toBe(INITIAL_PREDICATE_KIND_LIST_ITEM_STATE);
  });
});
