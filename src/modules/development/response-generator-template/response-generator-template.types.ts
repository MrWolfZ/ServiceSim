import { Aggregate } from '../../../api-infrastructure/api-infrastructure.types';
import { Diff } from '../../../util';
import { Parameter } from '../parameter/parameter.types';

export interface ResponseGeneratorTemplateData {
  name: string;
  description: string;
  generatorFunctionBody: string;
  parameters: Parameter[];
}

export type ResponseGeneratorTemplateAggregateType = 'response-generator-template';

export type ResponseGeneratorTemplateAggregate = ResponseGeneratorTemplateData & Aggregate<ResponseGeneratorTemplateAggregateType>;

export interface ResponseGeneratorTemplateDto extends ResponseGeneratorTemplateData {
  id: string;
  version: number;
}

export interface ResponseGeneratorTemplateState extends ResponseGeneratorTemplateDto { }

export interface CreateResponseGeneratorTemplateCommand extends ResponseGeneratorTemplateData { }

export interface UpdateResponseGeneratorTemplateCommand {
  templateId: string;
  unmodifiedTemplateVersion: number;
  diff: Diff<ResponseGeneratorTemplateData>;
}

export interface DeleteResponseGeneratorTemplateCommand {
  templateId: string;
  unmodifiedTemplateVersion: number;
}