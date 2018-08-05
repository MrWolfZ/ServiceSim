import { Parameter } from '../parameter';
import { ResponseGeneratorTemplateDto } from './response-generator-template.dto';

export interface ResponseGeneratorTemplate extends ResponseGeneratorTemplateDto {
  parameters: Parameter[];
}

export interface ResponseGeneratorTemplateSnapshot extends ResponseGeneratorTemplate {
  version: number;
}
