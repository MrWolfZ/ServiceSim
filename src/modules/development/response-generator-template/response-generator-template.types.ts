import { Aggregate } from 'src/domain/infrastructure/ddd';
import { Diff } from 'src/domain/infrastructure/diff';
import { Parameter } from 'src/domain/parameter';

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
