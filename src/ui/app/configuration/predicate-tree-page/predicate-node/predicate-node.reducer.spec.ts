import { InitializePredicateNodeAction } from './predicate-node.actions';
import { PredicateNodeDto } from './predicate-node.dto';
import { predicateNodeReducer } from './predicate-node.reducer';
import { INITIAL_PREDICATE_NODE_STATE } from './predicate-node.state';

export const MOCK_PREDICATE_NODE_DTO: PredicateNodeDto = {
  nodeId: 'nodeId',
  predicateKindName: '',
  parameters: [],
  childNodes: [],
  responseGenerator: undefined,
};

describe(predicateNodeReducer.name, () => {
  it('should return the initial state when called with undefined state', () => {
    expect(predicateNodeReducer(undefined, { type: 'INIT' } as any)).toBeDefined();
  });

  it('should return the modified state when called with initialization action', () => {
    const initializedState = predicateNodeReducer(
      INITIAL_PREDICATE_NODE_STATE,
      new InitializePredicateNodeAction(MOCK_PREDICATE_NODE_DTO),
    );

    expect(initializedState).not.toBe(INITIAL_PREDICATE_NODE_STATE);
  });
});
