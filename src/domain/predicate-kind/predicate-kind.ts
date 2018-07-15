import uuid from 'uuid';

import * as eser from '../../infrastructure/event-sourced-entity-repository';
import * as esre from '../../infrastructure/event-sourced-root-entity';
import * as pkc from './predicate-kind-created';
import * as pda from './property-descriptor-added';

export interface PredicateKind extends esre.EventSourcedRootEntity<DomainEvents> {
  name: string;
  description: string;
  propertyDescriptors: PropertyDescriptor[];
  evalFunctionBody: string;
}

export interface PropertyDescriptor {
  name: string;
  description: string;
  isRequired: boolean;
  valueType: 'string' | 'boolean' | 'number';
}

export const NULL: PredicateKind = {
  ...esre.NULL,
  name: '',
  description: '',
  propertyDescriptors: [],
  evalFunctionBody: 'return true;',
};

export type DomainEvents =
  | pkc.PredicateKindCreated
  | pda.PropertyDescriptorAdded
  ;

export const EVENT_HANDLER_MAP: esre.EntityEventHandlerMap<PredicateKind, DomainEvents> = {
  [pkc.KIND]: (e, ev): PredicateKind => {
    return {
      ...e,
      id: ev.predicateKindId,
      name: ev.name,
      description: ev.description,
    };
  },
  [pda.KIND]: (e, ev): PredicateKind => {
    return {
      ...e,
      propertyDescriptors: [
        ...e.propertyDescriptors,
        {
          name: ev.name,
          description: ev.description,
          isRequired: ev.isRequired,
          valueType: ev.valueType,
        },
      ],
    };
  },
};

export const apply = esre.createApply(EVENT_HANDLER_MAP);
export const createFromEvents = esre.createFromEvents(NULL, EVENT_HANDLER_MAP);

export const create = (
  name: string,
  description: string,
  evalFunctionBody: string,
) => apply(NULL, pkc.create({
  predicateKindId: `predicate-kind/${uuid()}`,
  name,
  description,
  evalFunctionBody,
}));

export const addPropertyDescriptor = (
  predicateKind: PredicateKind,
  name: string,
  description: string,
  isRequired: boolean,
  valueType: 'string' | 'boolean' | 'number',
) => apply(predicateKind, pda.create({
  predicateKindId: predicateKind.id,
  name,
  description,
  isRequired,
  valueType,
}));

const JOURNAL_NAME = 'predicate-kind/Journal';

export const ofIdAsync = eser.entityOfIdAsync(JOURNAL_NAME, apply, createFromEvents);
export const saveAsync = eser.saveAsync<PredicateKind, DomainEvents>(JOURNAL_NAME);
export const saveSnapshotAsync = eser.saveSnapshotAsync<PredicateKind, DomainEvents>(JOURNAL_NAME);
