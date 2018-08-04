export interface PredicateTemplateParameterFormValue {
  name: string;
  description: string;
  isRequired: boolean;
  valueType: 'string' | 'boolean' | 'number';
  defaultValue: string | boolean | number;
}

export interface PredicateTemplateDialogFormValue {
  name: string;
  description: string;
  evalFunctionBody: string;
  parameters: PredicateTemplateParameterFormValue[];
}
