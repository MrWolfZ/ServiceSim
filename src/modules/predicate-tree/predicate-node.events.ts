import { DomainEvent } from '../../api-infrastructure';
import { EventHandlerMap } from '../../api-infrastructure/api-infrastructure.types';
import { PredicateNodeData, PredicateNodeEntity, ResponseGeneratorData } from './predicate-node.types';

export class PredicateNodeCreated extends DomainEvent<typeof PredicateNodeCreated.KIND> {
  nodeId: string;
  data: PredicateNodeData;

  static readonly KIND = 'predicate/PredicateNodeCreated';
  static readonly create = DomainEvent.createBase(PredicateNodeCreated);

  static createApply(instance: PredicateNodeEntity) {
    return (event: PredicateNodeCreated) => {
      instance.id = event.nodeId;
      Object.assign(instance, event.data);
    };
  }
}

export class ChildPredicateNodeAdded extends DomainEvent<typeof ChildPredicateNodeAdded.KIND> {
  parentNodeId: string;
  childNodeId: string;

  static readonly KIND = 'predicate/ChildPredicateNodeAdded';
  static readonly create = DomainEvent.createBase(ChildPredicateNodeAdded);

  static createApply(instance: PredicateNodeEntity) {
    return (event: ChildPredicateNodeAdded) => {
      if (!Array.isArray(instance.childNodeIdsOrResponseGenerator)) {
        instance.childNodeIdsOrResponseGenerator = [];
      }

      instance.childNodeIdsOrResponseGenerator.push(event.childNodeId);
    };
  }
}

export class ResponseGeneratorSet extends DomainEvent<typeof ResponseGeneratorSet.KIND> {
  nodeId: string;
  responseGenerator: ResponseGeneratorData;

  static readonly KIND = 'predicate/ResponseGeneratorSet';
  static readonly create = DomainEvent.createBase(ResponseGeneratorSet);

  static createApply(instance: PredicateNodeEntity) {
    return (event: ResponseGeneratorSet) => {
      instance.childNodeIdsOrResponseGenerator = event.responseGenerator;
    };
  }
}

export type PredicateNodeDomainEvents =
  | PredicateNodeCreated
  | ChildPredicateNodeAdded
  | ResponseGeneratorSet
  ;

export function createEventHandlerMap(instance: PredicateNodeEntity): EventHandlerMap<PredicateNodeDomainEvents> {
  return {
    [PredicateNodeCreated.KIND]: PredicateNodeCreated.createApply(instance),
    [ChildPredicateNodeAdded.KIND]: ChildPredicateNodeAdded.createApply(instance),
    [ResponseGeneratorSet.KIND]: ResponseGeneratorSet.createApply(instance),
  };
}
