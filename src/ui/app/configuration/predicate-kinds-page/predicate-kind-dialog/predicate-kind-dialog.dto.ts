export interface PredicateKindParameterFormValue {
  name: string;
  description: string;
  isRequired: boolean;
  valueType: 'string' | 'boolean' | 'number';
  defaultValue: string | boolean | number;
}

export interface PredicateKindDialogFormValue {
  name: string;
  description: string;
  evalFunctionBody: string;
  parameters: PredicateKindParameterFormValue[];
}
