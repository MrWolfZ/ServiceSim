import { ParameterDto } from '../parameter/parameter.dto';

export interface PredicateTemplateDto {
  templateId: string;
  name: string;
  description: string;
  evalFunctionBody: string;
  parameters: ParameterDto[];
}

export interface PredicateTemplateSnapshotDto extends PredicateTemplateDto {
  version: number;
}
