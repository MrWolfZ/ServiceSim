import { Parameter } from '../parameter/parameter';

export interface ResponseGeneratorTemplateSnapshot {
  templateId: string;
  version: number;
  name: string;
  description: string;
  parameters: Parameter[];
  generatorFunctionBody: string;
}
