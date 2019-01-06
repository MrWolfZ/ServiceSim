import { DomainEvent, EventDrivenRootEntity, EventDrivenRootEntityDefinition } from '../../api-infrastructure/api-infrastructure.types';
import { PredicateTemplateData } from '../predicate-template/predicate-template.types';
import { ResponseGeneratorTemplateData } from '../response-generator-template/response-generator-template.types';

export interface TemplateInfo {
  templateId: string;
  templateVersion: number;
  parameterValues: { [prop: string]: string | number | boolean };
}

export interface ResponseGeneratorData {
  name: string;
  description: string;
  templateInfoOrGeneratorFunctionBody: TemplateInfo | string;
}

export interface PredicateNodeData {
  name: string;
  description: string;
  templateInfoOrEvalFunctionBody: TemplateInfo | string;
  childNodeIdsOrResponseGenerator: string[] | ResponseGeneratorData;
}

export type PredicateNodeEntityType = 'predicate-node';

export type RootNodeName = 'ROOT';

export interface PredicateNodeEntity extends
  PredicateNodeData, EventDrivenRootEntity<PredicateNodeEntity, PredicateNodeEntityType, PredicateNodeDomainEvents> { }

export type PredicateNodeEntityDefinition = EventDrivenRootEntityDefinition<PredicateNodeEntity, PredicateNodeEntityType, PredicateNodeDomainEvents>;

export interface ChildPredicateNodeAdded extends DomainEvent<PredicateNodeEntityType, 'ChildPredicateNodeAdded'> {
  childNodeId: string;
}

export interface ResponseGeneratorSet extends DomainEvent<PredicateNodeEntityType, 'ResponseGeneratorSet'> {
  responseGenerator: ResponseGeneratorData;
}

export type PredicateNodeDomainEvents =
  | ChildPredicateNodeAdded
  | ResponseGeneratorSet
  ;

export interface PredicateNodeDto extends PredicateNodeData {
  id: string;
  version: number;
  templateInfoOrEvalFunctionBody: (TemplateInfo & { templateDataSnapshot: PredicateTemplateData }) | string;
  childNodeIdsOrResponseGenerator: string[] |
  (ResponseGeneratorData & { templateInfoOrGeneratorFunctionBody: (TemplateInfo & { templateDataSnapshot: ResponseGeneratorTemplateData }) | string })
  ;
}

export interface PredicateNodeState extends PredicateNodeDto { }

export interface PredicateNodeFormValue {
  name: string;
  description: string;
  evalFunctionBody: string;
  parameterValues: {
    [param: string]: string | boolean | number;
  };
}

export interface CreatePredicateNodeCommand extends Omit<PredicateNodeData, 'childNodeIdsOrResponseGenerator'> {
  parentNodeId: string;
}

export interface UpdatePredicateNodeCommand {
  nodeId: string;
  unmodifiedNodeVersion: number;
  name?: string;
  description?: string;
  parameterValuesOrEvalFunctionBody: { [prop: string]: string | number | boolean } | string;
}

export interface SetResponseGeneratorCommand {
  nodeId: string;
  unmodifiedNodeVersion: number;
  name: string;
  description: string;
  templateInfoOrGeneratorFunctionBody: TemplateInfo | string;
}

export interface DeletePredicateNodeCommand {
  nodeId: string;
  unmodifiedNodeVersion: number;
}
