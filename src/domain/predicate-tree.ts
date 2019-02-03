import { Aggregate, DomainEvent } from 'src/domain/infrastructure/ddd';
import { PredicateTemplateData } from 'src/domain/predicate-template';
import { ResponseGeneratorTemplateData } from 'src/domain/response-generator-template';

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

export const ROOT_NODE_NAME = 'Root';

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
