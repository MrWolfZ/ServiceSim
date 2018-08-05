import { Parameter } from '../parameter';

export interface ResponseGeneratorTemplateSnapshot {
  templateId: string;
  version: number;
  name: string;
  description: string;
  parameters: Parameter[];
  generatorFunctionBody: string;
}
