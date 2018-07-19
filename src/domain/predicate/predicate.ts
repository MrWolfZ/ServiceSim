import uuid from 'uuid';

import { EntityEventHandlerMap, EventSourcedEntityRepository, EventSourcedRootEntity } from '../../infrastructure';
import { PredicateCreated } from './predicate-created';
import { ResponseGeneratorSet } from './response-generator-set';

const JOURNAL_NAME = 'predicate/Journal';

type DomainEvents =
  | PredicateCreated
  | ResponseGeneratorSet
  ;

export interface ResponseGenerator {
  responseGeneratorKindId: string;
  properties: { [prop: string]: string | number | boolean };
}

export class Predicate extends EventSourcedRootEntity<DomainEvents> {
  predicateKindId = '';
  properties: { [prop: string]: string | number | boolean } = {};
  childPredicateIdsOrResponseGenerator: string[] | ResponseGenerator | undefined;

  static create(
    predicateKindId: string,
    properties: { [prop: string]: string | number | boolean } = {},
    parentPredicateId: string | undefined,
  ) {
    return new Predicate().apply(PredicateCreated.create({
      predicateId: `predicate/${uuid()}`,
      predicateKindId,
      properties,
      parentPredicateId,
    }));
  }

  setResponseGenerator = (
    responseGeneratorKindId: string,
    properties: { [prop: string]: string | number | boolean },
  ) => {
    if (Array.isArray(this.childPredicateIdsOrResponseGenerator) && this.childPredicateIdsOrResponseGenerator.length > 0) {
      throw new Error(`Cannot set response generator for predicate ${this.id} since it already has child predicates!`);
    }

    return this.apply(ResponseGeneratorSet.create({
      predicateId: this.id,
      responseGeneratorKindId,
      properties,
    }));
  }

  EVENT_HANDLERS: EntityEventHandlerMap<DomainEvents> = {
    [PredicateCreated.KIND]: event => {
      this.id = event.predicateId;
      this.predicateKindId = event.predicateKindId;
      this.properties = event.properties;
    },
    [ResponseGeneratorSet.KIND]: event => {
      this.childPredicateIdsOrResponseGenerator = {
        responseGeneratorKindId: event.responseGeneratorKindId,
        properties: event.properties,
      };
    },
  };

  getSnapshotValue() {
    return {
      predicateKindId: this.predicateKindId,
      properties: this.properties,
      childPredicateIdsOrResponseGeneratorId: this.childPredicateIdsOrResponseGenerator,
    };
  }

  static readonly fromEvents = EventSourcedRootEntity.fromEventsBase<Predicate, DomainEvents>(Predicate);
  static readonly ofIdAsync = EventSourcedEntityRepository.entityOfIdAsync(JOURNAL_NAME, Predicate.fromEvents);
  static readonly saveAsync = EventSourcedEntityRepository.saveAsync<Predicate, DomainEvents>(JOURNAL_NAME);
  static readonly saveSnapshotAsync = EventSourcedEntityRepository.saveSnapshotAsync<Predicate, DomainEvents>(JOURNAL_NAME);
}
