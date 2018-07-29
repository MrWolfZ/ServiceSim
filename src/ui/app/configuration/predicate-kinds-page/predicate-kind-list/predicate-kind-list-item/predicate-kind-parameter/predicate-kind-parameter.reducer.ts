import { InitializePredicateKindParameterAction, PredicateKindParameterActions, SetIsReadOnlyAction } from './predicate-kind-parameter.actions';
import { INITIAL_PREDICATE_KIND_PARAMETER_STATE, PredicateKindParameterState } from './predicate-kind-parameter.state';

export function predicateKindParameterReducer(
  state = INITIAL_PREDICATE_KIND_PARAMETER_STATE,
  action: PredicateKindParameterActions,
): PredicateKindParameterState {
  switch (action.type) {
    case InitializePredicateKindParameterAction.TYPE:
      return {
        ...state,
        ...action.dto,
      };

    case SetIsReadOnlyAction.TYPE:
      return {
        ...state,
        isReadOnly: action.isReadOnly,
      };

    default:
      return state;
  }
}
