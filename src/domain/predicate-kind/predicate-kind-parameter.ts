export interface PredicateKindParameter {
  name: string;
  description: string;
  isRequired: boolean;
  valueType: 'string' | 'boolean' | 'number';
  defaultValue: string | boolean | number;
}
