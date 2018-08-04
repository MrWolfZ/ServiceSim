import { OpenPredicateTemplateDialogAction } from './predicate-template-dialog.actions';
import { predicateTemplateDialogReducer } from './predicate-template-dialog.reducer';
import { INITIAL_PREDICATE_TEMPLATE_DIALOG_STATE } from './predicate-template-dialog.state';

describe(predicateTemplateDialogReducer.name, () => {
  it('should return the initial state when called with undefined state', () => {
    expect(predicateTemplateDialogReducer(undefined, { type: 'INIT' } as any)).toBeDefined();
  });

  it('should return the modified state when called with open action', () => {
    const initializedState = predicateTemplateDialogReducer(
      INITIAL_PREDICATE_TEMPLATE_DIALOG_STATE,
      new OpenPredicateTemplateDialogAction(),
    );

    expect(initializedState).not.toBe(INITIAL_PREDICATE_TEMPLATE_DIALOG_STATE);
  });
});
