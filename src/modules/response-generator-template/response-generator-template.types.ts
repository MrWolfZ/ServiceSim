import { EventSourcedRootEntityData } from '../../api-infrastructure/api-infrastructure.types';
import { Parameter } from '../parameter/parameter.types';

export interface ResponseGeneratorTemplateData {
  name: string;
  description: string;
  generatorFunctionBody: string;
  parameters: Parameter[];
}

export type ResponseGeneratorTemplateEntity = ResponseGeneratorTemplateData & EventSourcedRootEntityData<any>;

export interface ResponseGeneratorTemplateDto extends ResponseGeneratorTemplateData {
  id: string;
  version: number;
}

export interface ResponseGeneratorTemplateState extends ResponseGeneratorTemplateDto { }

export interface CreateResponseGeneratorTemplateCommand {
  templateId: string;
  data: ResponseGeneratorTemplateData;
}

export interface UpdateResponseGeneratorTemplateCommand {
  templateId: string;
  unmodifiedTemplateVersion: number;
  data: Partial<ResponseGeneratorTemplateData>;
}
