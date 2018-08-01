import { OpenPredicateKindDialogAction } from './predicate-kind-dialog.actions';
import { predicateKindDialogReducer } from './predicate-kind-dialog.reducer';
import { INITIAL_PREDICATE_KIND_DIALOG_STATE } from './predicate-kind-dialog.state';

describe(predicateKindDialogReducer.name, () => {
  it('should return the initial state when called with undefined state', () => {
    expect(predicateKindDialogReducer(undefined, { type: 'INIT' } as any)).toBeDefined();
  });

  it('should return the modified state when called with open action', () => {
    const initializedState = predicateKindDialogReducer(
      INITIAL_PREDICATE_KIND_DIALOG_STATE,
      new OpenPredicateKindDialogAction(),
    );

    expect(initializedState).not.toBe(INITIAL_PREDICATE_KIND_DIALOG_STATE);
  });
});
