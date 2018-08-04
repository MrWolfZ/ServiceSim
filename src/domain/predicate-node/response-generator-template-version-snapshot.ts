import { Parameter } from '../parameter';

export interface ResponseGeneratorTemplateVersionSnapshot {
  templateId: string;
  version: number;
  name: string;
  description: string;
  parameters: Parameter[];
  generatorFunctionBody: string;
}
