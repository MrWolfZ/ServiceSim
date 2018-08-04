import { Parameter } from '../parameter';

export interface ResponseGeneratorKindVersionSnapshot {
  responseGeneratorKindId: string;
  version: number;
  name: string;
  description: string;
  parameters: Parameter[];
  generatorFunctionBody: string;
}
