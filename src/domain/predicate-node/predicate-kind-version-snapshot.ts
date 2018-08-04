import { Parameter } from '../parameter';

export interface PredicateKindVersionSnapshot {
  predicateKindId: string;
  version: number;
  name: string;
  description: string;
  parameters: Parameter[];
  evalFunctionBody: string;
}
