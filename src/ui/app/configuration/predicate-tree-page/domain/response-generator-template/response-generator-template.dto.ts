import { ParameterDto } from '../parameter/parameter.dto';

export interface ResponseGeneratorTemplateDto {
  templateId: string;
  name: string;
  description: string;
  generatorFunctionBody: string;
  parameters: ParameterDto[];
}

export interface ResponseGeneratorTemplateVersionSnapshotDto extends ResponseGeneratorTemplateDto {
  version: number;
}
