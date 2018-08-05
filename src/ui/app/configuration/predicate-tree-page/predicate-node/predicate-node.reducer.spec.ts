import { predicateNodeReducer } from './predicate-node.reducer';

describe(predicateNodeReducer.name, () => {
  it('should return the initial state when called with undefined state', () => {
    expect(predicateNodeReducer(undefined, { type: 'INIT' } as any)).toBeDefined();
  });
});
