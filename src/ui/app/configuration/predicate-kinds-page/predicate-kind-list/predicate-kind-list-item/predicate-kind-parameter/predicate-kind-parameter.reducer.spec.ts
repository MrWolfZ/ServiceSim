import { InitializePredicateKindParameterAction } from './predicate-kind-parameter.actions';
import { PredicateKindParameterDto } from './predicate-kind-parameter.dto';
import { predicateKindParameterReducer } from './predicate-kind-parameter.reducer';
import { INITIAL_PREDICATE_KIND_PARAMETER_STATE } from './predicate-kind-parameter.state';

export const MOCK_PREDICATE_KIND_PARAMETER_DTO: PredicateKindParameterDto = {
  name: '',
  description: '',
  isRequired: true,
  valueType: 'string',
  defaultValue: '',
};

describe(predicateKindParameterReducer.name, () => {
  it('should return the initial state when called with undefined state', () => {
    expect(predicateKindParameterReducer(undefined, { type: 'INIT' } as any)).toBeDefined();
  });

  it('should return the modified state when called with initialization action', () => {
    const initializedState = predicateKindParameterReducer(
      INITIAL_PREDICATE_KIND_PARAMETER_STATE,
      new InitializePredicateKindParameterAction(MOCK_PREDICATE_KIND_PARAMETER_DTO),
    );

    expect(initializedState).not.toBe(INITIAL_PREDICATE_KIND_PARAMETER_STATE);
  });
});
