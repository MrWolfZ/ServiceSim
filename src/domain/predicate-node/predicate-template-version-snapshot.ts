import { Parameter } from '../parameter';

export interface PredicateTemplateVersionSnapshot {
  templateId: string;
  version: number;
  name: string;
  description: string;
  parameters: Parameter[];
  evalFunctionBody: string;
}
