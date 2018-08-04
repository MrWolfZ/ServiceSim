export interface PredicateTemplateParameterDto {
  name: string;
  description: string;
  isRequired: boolean;
  valueType: 'string' | 'boolean' | 'number';
  defaultValue: string | boolean | number;
}

export interface PredicateTemplateTileDto {
  templateId: string;
  name: string;
  description: string;
  evalFunctionBody: string;
  parameters: PredicateTemplateParameterDto[];
}
