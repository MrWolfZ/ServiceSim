import uuid from 'uuid';

import { EntityEventHandlerMap, EventSourcedEntityRepository, EventSourcedRootEntity } from '../../infrastructure';
import { PredicateCreated } from './predicate-created';
import { ResponseGeneratorSet } from './response-generator-set';

const JOURNAL_NAME = 'predicate/Journal';

type DomainEvents =
  | PredicateCreated
  | ResponseGeneratorSet
  ;

export class Predicate extends EventSourcedRootEntity<DomainEvents> {
  predicateKindId = '';
  properties: { [prop: string]: string | number | boolean } = {};
  childPredicateIdsOrResponseGeneratorId: string[] | string | undefined;

  static create(
    predicateKindId: string,
    properties: { [prop: string]: string | number | boolean } = {},
  ) {
    return new Predicate().apply(PredicateCreated.create({
      predicateId: `predicate/${uuid()}`,
      predicateKindId,
      properties,
    }));
  }

  setResponseGenerator = (
    responseGeneratorId: string,
  ) => {
    if (Array.isArray(this.childPredicateIdsOrResponseGeneratorId) && this.childPredicateIdsOrResponseGeneratorId.length > 0) {
      throw new Error(`Cannot set response generator for predicate ${this.id} since it already has child predicates!`);
    }

    return this.apply(ResponseGeneratorSet.create({
      predicateId: this.id,
      responseGeneratorId,
    }));
  }

  EVENT_HANDLERS: EntityEventHandlerMap<DomainEvents> = {
    [PredicateCreated.KIND]: event => {
      this.id = event.predicateId;
      this.predicateKindId = event.predicateKindId;
      this.properties = event.properties;
    },
    [ResponseGeneratorSet.KIND]: event => {
      this.childPredicateIdsOrResponseGeneratorId = event.responseGeneratorId;
    },
  };

  getSnapshotValue() {
    return {
      predicateKindId: this.predicateKindId,
      properties: this.properties,
      childPredicateIdsOrResponseGeneratorId: this.childPredicateIdsOrResponseGeneratorId,
    };
  }

  static readonly fromEvents = EventSourcedRootEntity.fromEventsBase<Predicate, DomainEvents>(Predicate);
  static readonly ofIdAsync = EventSourcedEntityRepository.entityOfIdAsync(JOURNAL_NAME, Predicate.fromEvents);
  static readonly saveAsync = EventSourcedEntityRepository.saveAsync<Predicate, DomainEvents>(JOURNAL_NAME);
  static readonly saveSnapshotAsync = EventSourcedEntityRepository.saveSnapshotAsync<Predicate, DomainEvents>(JOURNAL_NAME);
}
