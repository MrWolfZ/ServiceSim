import { InitializePredicateNodeDetailsAction } from './predicate-node-details.actions';
import { PredicateNodeDetailsDto } from './predicate-node-details.dto';
import { predicateNodeDetailsReducer } from './predicate-node-details.reducer';
import { INITIAL_PREDICATE_NODE_DETAILS_STATE } from './predicate-node-details.state';

export const MOCK_PREDICATE_NODE_DETAILS_DTO: PredicateNodeDetailsDto = {
  nodeId: 'nodeId',
  predicateKindName: '',
  childNodes: [],
  parameters: [],
  responseGenerator: undefined,
};

describe(predicateNodeDetailsReducer.name, () => {
  it('should return the initial state when called with undefined state', () => {
    expect(predicateNodeDetailsReducer(undefined, { type: 'INIT' } as any)).toBeDefined();
  });

  it('should return the modified state when called with initialization action', () => {
    const initializedState = predicateNodeDetailsReducer(
      INITIAL_PREDICATE_NODE_DETAILS_STATE,
      new InitializePredicateNodeDetailsAction(MOCK_PREDICATE_NODE_DETAILS_DTO),
    );

    expect(initializedState).not.toBe(INITIAL_PREDICATE_NODE_DETAILS_STATE);
  });
});
