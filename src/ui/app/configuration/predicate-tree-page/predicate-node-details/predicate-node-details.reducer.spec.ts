import { predicateNodeDetailsReducer } from './predicate-node-details.reducer';

describe(predicateNodeDetailsReducer.name, () => {
  it('should return the initial state when called with undefined state', () => {
    expect(predicateNodeDetailsReducer(undefined, { type: 'INIT' } as any)).toBeDefined();
  });
});
