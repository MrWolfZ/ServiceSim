export interface PredicateKindParameterDto {
  name: string;
  description: string;
  isRequired: boolean;
  valueType: 'string' | 'boolean' | 'number';
  defaultValue: string | boolean | number;
}

export interface PredicateKindParameterFormValue {
  name: string;
  description: string;
  isRequired: boolean;
  valueType: 'string' | 'boolean' | 'number';
  defaultValue: string | boolean | number;
}
