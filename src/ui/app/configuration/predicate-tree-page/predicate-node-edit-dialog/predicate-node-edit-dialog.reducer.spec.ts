import { predicateNodeEditDialogReducer } from './predicate-node-edit-dialog.reducer';

describe(predicateNodeEditDialogReducer.name, () => {
  it('should return the initial state when called with undefined state', () => {
    expect(predicateNodeEditDialogReducer(undefined, { type: 'INIT' } as any)).toBeDefined();
  });
});
