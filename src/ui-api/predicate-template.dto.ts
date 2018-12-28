import { ParameterDto } from './parameter.dto';

export interface PredicateTemplateDto {
  id: string;
  name: string;
  description: string;
  parameters: ParameterDto[];
  evalFunctionBody: string;
}
