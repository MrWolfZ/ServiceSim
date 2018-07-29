import uuid from 'uuid';

import { EventHandlerMap, EventSourcedEntityRepository, EventSourcedRootEntity } from '../../infrastructure';
import { ChildPredicateAdded } from './child-predicate-added';
import { PredicateCreated } from './predicate-created';
import { ResponseGeneratorSet } from './response-generator-set';

const JOURNAL_NAME = 'predicate/Journal';

type DomainEvents =
  | PredicateCreated
  | ResponseGeneratorSet
  | ChildPredicateAdded
  ;

export interface ResponseGenerator {
  responseGeneratorKindId: string;
  parameters: { [prop: string]: string | number | boolean };
}

export class Predicate extends EventSourcedRootEntity<DomainEvents> {
  predicateKindId = '';
  parameters: { [prop: string]: string | number | boolean } = {};
  childPredicateIdsOrResponseGenerator: string[] | ResponseGenerator | undefined;

  static create(
    predicateKindId: string,
    parameters: { [prop: string]: string | number | boolean } = {},
    parentPredicateId: string | undefined,
  ) {
    return new Predicate().apply(PredicateCreated.create({
      predicateId: `predicate/${uuid()}`,
      predicateKindId,
      parameters,
      parentPredicateId,
    }));
  }

  setResponseGenerator(
    responseGeneratorKindId: string,
    parameters: { [prop: string]: string | number | boolean },
  ) {
    if (Array.isArray(this.childPredicateIdsOrResponseGenerator) && this.childPredicateIdsOrResponseGenerator.length > 0) {
      throw new Error(`Cannot set response generator for predicate ${this.id} since it already has child predicates!`);
    }

    return this.apply(ResponseGeneratorSet.create({
      predicateId: this.id,
      responseGeneratorKindId,
      parameters,
    }));
  }

  addChildPredicate(
    predicateId: string,
  ) {
    if (!!this.childPredicateIdsOrResponseGenerator && !!(this.childPredicateIdsOrResponseGenerator as ResponseGenerator).responseGeneratorKindId) {
      throw new Error(`Cannot add child predicate for predicate ${this.id} since it already has a response generator set!`);
    }

    return this.apply(ChildPredicateAdded.create({
      parentPredicateId: this.id,
      childPredicateId: predicateId,
    }));
  }

  EVENT_HANDLERS: EventHandlerMap<DomainEvents> = {
    [PredicateCreated.KIND]: event => {
      this.id = event.predicateId;
      this.predicateKindId = event.predicateKindId;
      this.parameters = event.parameters;
    },
    [ResponseGeneratorSet.KIND]: event => {
      this.childPredicateIdsOrResponseGenerator = {
        responseGeneratorKindId: event.responseGeneratorKindId,
        parameters: event.parameters,
      };
    },
    [ChildPredicateAdded.KIND]: event => {
      if (!Array.isArray(this.childPredicateIdsOrResponseGenerator)) {
        this.childPredicateIdsOrResponseGenerator = [];
      }

      this.childPredicateIdsOrResponseGenerator.push(event.childPredicateId);
    },
  };

  getSnapshotValue() {
    return {
      predicateKindId: this.predicateKindId,
      parameters: this.parameters,
      childPredicateIdsOrResponseGeneratorId: this.childPredicateIdsOrResponseGenerator,
    };
  }

  static readonly fromEvents = EventSourcedRootEntity.fromEventsBase<Predicate, DomainEvents>(Predicate);
  static readonly ofIdAsync = EventSourcedEntityRepository.entityOfIdAsync(JOURNAL_NAME, Predicate.fromEvents);
  static readonly saveAsync = EventSourcedEntityRepository.saveAsync<Predicate, DomainEvents>(JOURNAL_NAME);
  static readonly saveSnapshotAsync = EventSourcedEntityRepository.saveSnapshotAsync<Predicate, DomainEvents>(JOURNAL_NAME);
}
