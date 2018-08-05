import { Parameter } from '../parameter';

export interface PredicateTemplateSnapshot {
  templateId: string;
  version: number;
  name: string;
  description: string;
  parameters: Parameter[];
  evalFunctionBody: string;
}
