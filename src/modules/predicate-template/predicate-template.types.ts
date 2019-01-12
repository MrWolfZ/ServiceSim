import { Aggregate } from '../../api-infrastructure/api-infrastructure.types';
import { Diff } from '../../util';
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

export interface CreatePredicateTemplateCommandResponse {
  templateId: string;
  templateVersion: number;
}

export interface UpdatePredicateTemplateCommand {
  templateId: string;
  unmodifiedTemplateVersion: number;
  diff: Diff<PredicateTemplateData>;
}

export interface DeletePredicateTemplateCommand {
  templateId: string;
  unmodifiedTemplateVersion: number;
}
