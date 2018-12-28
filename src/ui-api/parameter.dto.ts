export interface TypedParameterDto<TValueType, TDefaultValue> {
  name: string;
  description: string;
  isRequired: boolean;
  valueType: TValueType;
  defaultValue: TDefaultValue;
}

export type BooleanParameterDto = TypedParameterDto<'boolean', boolean>;
export type NumberParameterDto = TypedParameterDto<'number', number>;
export type StringParameterDto = TypedParameterDto<'string', string>;

export type ParameterDto =
  | BooleanParameterDto
  | NumberParameterDto
  | StringParameterDto
  ;
