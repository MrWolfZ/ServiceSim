export interface PredicateKindParameterDto {
  name: string;
  description: string;
  isRequired: boolean;
  valueType: 'string' | 'boolean' | 'number';
}

export interface PredicateKindListItemDto {
  predicateKindId: string;
  name: string;
  description: string;
  evalFunctionBody: string;
  parameters: PredicateKindParameterDto[];
}

export interface PredicateKindParameterFormValue {
  name: string;
  description: string;
  isRequired: boolean;
  valueType: 'string' | 'boolean' | 'number';
}

export interface PredicateKindListItemFormValue {
  name: string;
  description: string;
  evalFunctionBody: string;
  parameters: PredicateKindParameterFormValue[];
}
