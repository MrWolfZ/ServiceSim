export interface TypedParameterFormValue<TValueType, TDefaultValue> {
  name: string;
  description: string;
  isRequired: boolean;
  valueType: TValueType;
  defaultValue: TDefaultValue;
}

export type BooleanParameterFormValue = TypedParameterFormValue<'boolean', boolean>;
export type NumberParameterFormValue = TypedParameterFormValue<'number', number>;
export type StringParameterFormValue = TypedParameterFormValue<'string', string>;

export type ParameterFormValue =
  | BooleanParameterFormValue
  | NumberParameterFormValue
  | StringParameterFormValue
  ;

export interface PredicateTemplateDialogFormValue {
  name: string;
  description: string;
  evalFunctionBody: string;
  parameters: ParameterFormValue[];
}
