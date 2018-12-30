import { EventSourcedRootEntityData } from '../../api-infrastructure/api-infrastructure.types';
import { Parameter } from '../parameter/parameter.types';

export interface PredicateTemplateData {
  name: string;
  description: string;
  evalFunctionBody: string;
  parameters: Parameter[];
}

export type PredicateTemplateEntity = PredicateTemplateData & EventSourcedRootEntityData<any>;

export interface PredicateTemplateDto extends PredicateTemplateData {
  id: string;
  version: number;
}

export interface PredicateTemplateState extends PredicateTemplateDto { }

export interface CreatePredicateTemplateCommand {
  templateId: string;
  data: PredicateTemplateData;
}

export interface UpdatePredicateTemplateCommand {
  templateId: string;
  unmodifiedTemplateVersion: number;
  data: Partial<PredicateTemplateData>;
}
