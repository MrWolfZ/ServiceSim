import { PredicateKindParameterDto } from './predicate-kind-parameter.dto';

export interface PredicateKindParameterState extends PredicateKindParameterDto {
  isReadOnly: boolean;
}

export const INITIAL_PREDICATE_KIND_PARAMETER_STATE: PredicateKindParameterState = {
  name: '',
  description: '',
  isRequired: true,
  valueType: 'string',
  defaultValue: '',
  isReadOnly: true,
};
