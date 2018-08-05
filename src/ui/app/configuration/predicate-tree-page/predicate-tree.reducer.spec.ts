import { MOCK_PREDICATE_NODE_DTO } from './domain/predicate-node/predicate-node.reducer.spec';
import { InitializePredicateTreePageAction } from './predicate-tree.actions';
import { PredicateTreePageDto } from './predicate-tree.dto';
import { predicateTreePageReducer } from './predicate-tree.reducer';
import { INITIAL_PREDICATE_TREE_PAGE_STATE } from './predicate-tree.state';

export const MOCK_PREDICATE_TREE_PAGE_DTO: PredicateTreePageDto = {
  nodes: [MOCK_PREDICATE_NODE_DTO],
};

describe(predicateTreePageReducer.name, () => {
  it('should return the initial state when called with undefined state', () => {
    expect(predicateTreePageReducer(undefined, { type: 'INIT' } as any)).toBeDefined();
  });

  it('should return the modified state when called with initialization action', () => {
    const initializedState = predicateTreePageReducer(
      INITIAL_PREDICATE_TREE_PAGE_STATE,
      new InitializePredicateTreePageAction(MOCK_PREDICATE_TREE_PAGE_DTO),
    );

    expect(initializedState).not.toBe(INITIAL_PREDICATE_TREE_PAGE_STATE);
  });
});
