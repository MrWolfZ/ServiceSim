export interface PredicateKindParameterDto {
  name: string;
  description: string;
  isRequired: boolean;
  valueType: 'string' | 'boolean' | 'number';
  defaultValue: string | boolean | number;
}

export interface PredicateKindTileDto {
  predicateKindId: string;
  name: string;
  description: string;
  evalFunctionBody: string;
  parameters: PredicateKindParameterDto[];
}
