import uuid from 'uuid';

import { EventHandlerMap, EventSourcedEntityRepository, EventSourcedRootEntity } from '../../infrastructure';
import { ChildPredicateNodeAdded } from './child-predicate-node-added';
import { PredicateNodeCreated } from './predicate-node-created';
import { ResponseGeneratorSet } from './response-generator-set';

const JOURNAL_NAME = 'predicate/Journal';

type DomainEvents =
  | PredicateNodeCreated
  | ResponseGeneratorSet
  | ChildPredicateNodeAdded
  ;

export interface ResponseGenerator {
  responseGeneratorKindId: string;
  parameterValues: { [prop: string]: string | number | boolean };
}

export class PredicateNode extends EventSourcedRootEntity<DomainEvents> {
  predicateKindId = '';
  parameterValues: { [prop: string]: string | number | boolean } = {};
  childPredicateIdsOrResponseGenerator: string[] | ResponseGenerator | undefined;

  static create(
    predicateKindId: string,
    parameterValues: { [prop: string]: string | number | boolean } = {},
    parentPredicateNodeId: string | undefined,
  ) {
    return new PredicateNode().apply(PredicateNodeCreated.create({
      nodeId: `predicate/${uuid()}`,
      predicateKindId,
      parameterValues,
      parentPredicateNodeId,
    }));
  }

  setResponseGenerator(
    responseGeneratorKindId: string,
    parameterValues: { [prop: string]: string | number | boolean },
  ) {
    if (Array.isArray(this.childPredicateIdsOrResponseGenerator) && this.childPredicateIdsOrResponseGenerator.length > 0) {
      throw new Error(`Cannot set response generator for predicate node ${this.id} since it already has child predicates!`);
    }

    return this.apply(ResponseGeneratorSet.create({
      predicateId: this.id,
      responseGeneratorKindId,
      parameterValues,
    }));
  }

  addChildPredicate(
    predicateId: string,
  ) {
    if (!!this.childPredicateIdsOrResponseGenerator && !!(this.childPredicateIdsOrResponseGenerator as ResponseGenerator).responseGeneratorKindId) {
      throw new Error(`Cannot add child predicate node for predicate node ${this.id} since it already has a response generator set!`);
    }

    return this.apply(ChildPredicateNodeAdded.create({
      parentPredicateId: this.id,
      childPredicateId: predicateId,
    }));
  }

  EVENT_HANDLERS: EventHandlerMap<DomainEvents> = {
    [PredicateNodeCreated.KIND]: event => {
      this.id = event.nodeId;
      this.predicateKindId = event.predicateKindId;
      this.parameterValues = event.parameterValues;
    },
    [ResponseGeneratorSet.KIND]: event => {
      this.childPredicateIdsOrResponseGenerator = {
        responseGeneratorKindId: event.responseGeneratorKindId,
        parameterValues: event.parameterValues,
      };
    },
    [ChildPredicateNodeAdded.KIND]: event => {
      if (!Array.isArray(this.childPredicateIdsOrResponseGenerator)) {
        this.childPredicateIdsOrResponseGenerator = [];
      }

      this.childPredicateIdsOrResponseGenerator.push(event.childPredicateId);
    },
  };

  getSnapshotValue() {
    return {
      predicateKindId: this.predicateKindId,
      parameters: this.parameterValues,
      childPredicateIdsOrResponseGeneratorId: this.childPredicateIdsOrResponseGenerator,
    };
  }

  static readonly fromEvents = EventSourcedRootEntity.fromEventsBase<PredicateNode, DomainEvents>(PredicateNode);
  static readonly ofIdAsync = EventSourcedEntityRepository.entityOfIdAsync(JOURNAL_NAME, PredicateNode.fromEvents);
  static readonly saveAsync = EventSourcedEntityRepository.saveAsync<PredicateNode, DomainEvents>(JOURNAL_NAME);
  static readonly saveSnapshotAsync = EventSourcedEntityRepository.saveSnapshotAsync<PredicateNode, DomainEvents>(JOURNAL_NAME);
}
