import { PredicateKindParameterDto, PredicateKindParameterFormValue } from './predicate-kind-parameter/predicate-kind-parameter.dto';

export interface PredicateKindListItemDto {
  predicateKindId: string;
  name: string;
  description: string;
  evalFunctionBody: string;
  parameters: PredicateKindParameterDto[];
}

export interface PredicateKindListItemFormValue {
  name: string;
  description: string;
  evalFunctionBody: string;
  parameters: PredicateKindParameterFormValue[];
}
