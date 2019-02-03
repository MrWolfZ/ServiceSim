import { Aggregate } from './infrastructure/ddd';
import { Parameter } from './parameter';

export interface PredicateTemplateData {
  name: string;
  description: string;
  tags: string[];
  evalFunctionBody: string;
  parameters: Parameter[];
}

export type PredicateTemplateAggregateType = 'predicate-template';

export type PredicateTemplateAggregate = PredicateTemplateData & Aggregate<PredicateTemplateAggregateType>;
