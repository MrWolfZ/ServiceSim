import { Parameter } from '../parameter';
import { PredicateTemplateDto } from './predicate-template.dto';

export interface PredicateTemplate extends PredicateTemplateDto {
  parameters: Parameter[];
}

export interface PredicateTemplateSnapshot extends PredicateTemplate {
  version: number;
}
