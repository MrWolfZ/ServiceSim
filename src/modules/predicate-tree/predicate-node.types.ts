import { Aggregate, DomainEvent } from '../../api-infrastructure/api-infrastructure.types';
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

export type RootNodeName = 'ROOT';

export type PredicateNodeAggregateType = 'predicate-node';

export type PredicateNodeAggregate = PredicateNodeData & Aggregate<PredicateNodeAggregateType>;

export interface ChildPredicateNodeAdded extends DomainEvent<PredicateNodeAggregateType, 'ChildPredicateNodeAdded'> {
  childNodeId: string;
}

export interface ResponseGeneratorSetWithCustomBody extends DomainEvent<PredicateNodeAggregateType, 'ResponseGeneratorSetWithCustomBody'> {
  name: string;
  description: string;
  generatorFunctionBody: string;
}

export interface ResponseGeneratorSetFromTemplate extends DomainEvent<PredicateNodeAggregateType, 'ResponseGeneratorSetFromTemplate'> {
  name: string;
  description: string;
  templateInfo: TemplateInfo;
}

export type PredicateNodeDomainEvents =
  | ChildPredicateNodeAdded
  | ResponseGeneratorSetWithCustomBody
  | ResponseGeneratorSetFromTemplate
  ;

export interface PredicateTemplateInfoWithSnapshot extends TemplateInfo {
  templateDataSnapshot: PredicateTemplateData;
}

export interface ResponseGeneratorTemplateInfoWithSnapshot extends TemplateInfo {
  templateDataSnapshot: ResponseGeneratorTemplateData;
}

export interface ResponseGeneratorDataWithTemplateSnapshot extends ResponseGeneratorData {
  templateInfoOrGeneratorFunctionBody: ResponseGeneratorTemplateInfoWithSnapshot | string;
}

export interface PredicateNodeDto extends PredicateNodeData {
  id: string;
  version: number;
  templateInfoOrEvalFunctionBody: PredicateTemplateInfoWithSnapshot | string;
  childNodeIdsOrResponseGenerator: string[] | ResponseGeneratorDataWithTemplateSnapshot;
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

export interface AddChildPredicateNodeWithCustomFunctionBodyCommand {
  parentNodeId: string;
  name: string;
  description: string;
  evalFunctionBody: string;
}

export interface AddChildPredicateNodeFromTemplateCommand {
  parentNodeId: string;
  name: string;
  description: string;
  templateInfo: TemplateInfo;
}

export interface UpdatePredicateNodeCommand {
  nodeId: string;
  unmodifiedNodeVersion: number;
  name?: string;
  description?: string;
  parameterValuesOrEvalFunctionBody: { [prop: string]: string | number | boolean } | string;
}

export interface SetResponseGeneratorWithCustomBodyCommand {
  nodeId: string;
  unmodifiedNodeVersion: number;
  name: string;
  description: string;
  generatorFunctionBody: string;
}

export interface SetResponseGeneratorFromTemplateCommand {
  nodeId: string;
  unmodifiedNodeVersion: number;
  name: string;
  description: string;
  templateInfo: TemplateInfo;
}

export interface DeletePredicateNodeCommand {
  nodeId: string;
  unmodifiedNodeVersion: number;
}
