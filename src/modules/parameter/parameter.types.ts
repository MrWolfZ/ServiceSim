export interface TypedParameter<TValueType, TDefaultValue> {
  name: string;
  description: string;
  isRequired: boolean;
  valueType: TValueType;
  defaultValue: TDefaultValue;
}

export type BooleanParameter = TypedParameter<'boolean', boolean>;
export type NumberParameter = TypedParameter<'number', number>;
export type StringParameter = TypedParameter<'string', string>;

export type Parameter =
  | BooleanParameter
  | NumberParameter
  | StringParameter
  ;

export type ParameterFormValue = Parameter;
