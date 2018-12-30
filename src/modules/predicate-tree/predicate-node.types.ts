import { EventSourcedRootEntityData } from '../../api-infrastructure/api-infrastructure.types';
import { PredicateTemplateData } from '../predicate-template/predicate-template.types';
import { ResponseGeneratorTemplateData } from '../response-generator-template/response-generator-template.types';

export interface TemplateInfo<TData> {
  templateId: string;
  templateVersion: number;
  templateDataSnapshot: TData;
  parameterValues: { [prop: string]: string | number | boolean };
}

export interface PredicateTemplateInfo extends TemplateInfo<PredicateTemplateData> { }
export interface ResponseGeneratorTemplateInfo extends TemplateInfo<ResponseGeneratorTemplateData> { }

export interface ResponseGeneratorData {
  name: string;
  description: string;
  templateInfoOrGeneratorFunctionBody: ResponseGeneratorTemplateInfo | string;
}

export interface PredicateNodeData {
  name: string;
  description: string;
  templateInfoOrEvalFunctionBody: PredicateTemplateInfo | string;
  childNodeIdsOrResponseGenerator: string[] | ResponseGeneratorData | undefined;
}

export type PredicateNodeEntity = PredicateNodeData & EventSourcedRootEntityData<any>;

export interface PredicateNodeDto extends PredicateNodeData {
  id: string;
  version: number;
}

export interface PredicateNodeState extends PredicateNodeDto { }
