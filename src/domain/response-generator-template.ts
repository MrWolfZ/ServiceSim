import { Aggregate } from 'src/domain/infrastructure/ddd';
import { Parameter } from 'src/domain/parameter';

export interface ResponseGeneratorTemplateData {
  name: string;
  description: string;
  tags: string[];
  generatorFunctionBody: string;
  parameters: Parameter[];
}

export type ResponseGeneratorTemplateAggregateType = 'response-generator-template';

export type ResponseGeneratorTemplateAggregate = ResponseGeneratorTemplateData & Aggregate<ResponseGeneratorTemplateAggregateType>;
