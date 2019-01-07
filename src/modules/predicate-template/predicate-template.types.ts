import { Aggregate } from '../../api-infrastructure/api-infrastructure.types';
import { Parameter } from '../parameter/parameter.types';

export interface PredicateTemplateData {
  name: string;
  description: string;
  evalFunctionBody: string;
  parameters: Parameter[];
}

export type PredicateTemplateAggregateType = 'predicate-template';

export type PredicateTemplateAggregate = PredicateTemplateData & Aggregate;

export interface PredicateTemplateDto extends PredicateTemplateData {
  id: string;
  version: number;
}

export interface PredicateTemplateState extends PredicateTemplateDto { }

export interface PredicateTemplateFormValue extends PredicateTemplateData { }

export interface CreatePredicateTemplateCommand extends PredicateTemplateData { }

export interface UpdatePredicateTemplateCommand extends Partial<PredicateTemplateData> {
  templateId: string;
  unmodifiedTemplateVersion: number;
}

export interface DeletePredicateTemplateCommand {
  templateId: string;
  unmodifiedTemplateVersion: number;
}
