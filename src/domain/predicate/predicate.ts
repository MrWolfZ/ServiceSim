import uuid from 'uuid';

import * as eser from '../../infrastructure/event-sourced-entity-repository';
import * as esre from '../../infrastructure/event-sourced-root-entity';
import * as pc from './predicate-created';
import * as rgs from './response-generator-set';

export interface Predicate extends esre.EventSourcedRootEntity<DomainEvents> {
  predicateKindId: string;
  properties: { [prop: string]: string | number | boolean };
  childPredicateIdsOrResponseGeneratorId: string[] | string;
}

export const NULL: Predicate = {
  ...esre.NULL,
  predicateKindId: '',
  properties: {},
  childPredicateIdsOrResponseGeneratorId: [],
};

export type DomainEvents =
  | pc.PredicateCreated
  | rgs.ResponseGeneratorSet
  ;

export const EVENT_HANDLER_MAP: esre.EntityEventHandlerMap<Predicate, DomainEvents> = {
  [pc.KIND]: (e, ev): Predicate => {
    return {
      ...e,
      id: ev.predicateId,
      predicateKindId: ev.predicateKindId,
      properties: ev.properties,
    };
  },
  [rgs.KIND]: (e, ev): Predicate => {
    return {
      ...e,
      childPredicateIdsOrResponseGeneratorId: ev.responseGeneratorId,
    };
  },
};

export const apply = esre.createApply(EVENT_HANDLER_MAP);
export const createFromEvents = esre.createFromEvents(NULL, EVENT_HANDLER_MAP);

export const create = (
  predicateKindId: string,
  properties: { [prop: string]: string | number | boolean } = {},
) => apply(NULL, pc.create({
  predicateId: `predicate/${uuid()}`,
  predicateKindId,
  properties,
}));

export const setResponseGenerator = (
  predicate: Predicate,
  responseGeneratorId: string,
) => {
  if (Array.isArray(predicate.childPredicateIdsOrResponseGeneratorId) && predicate.childPredicateIdsOrResponseGeneratorId.length > 0) {
    throw new Error(`Cannot set response generator for predicate ${predicate.id} since it already has child predicates!`);
  }

  return apply(predicate, rgs.create({
    predicateId: predicate.id,
    responseGeneratorId,
  }));
};

const JOURNAL_NAME = 'predicate/Journal';

export const ofIdAsync = eser.entityOfIdAsync(JOURNAL_NAME, apply, createFromEvents);
export const saveAsync = eser.saveAsync<Predicate, DomainEvents>(JOURNAL_NAME);
export const saveSnapshotAsync = eser.saveSnapshotAsync<Predicate, DomainEvents>(JOURNAL_NAME);
