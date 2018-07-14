import * as eser from '../../infrastructure/event-sourced-entity-repository';
import * as esre from '../../infrastructure/event-sourced-root-entity';
import * as rmc from './request-matcher-created';

export interface RequestMatcher extends esre.EventSourcedRootEntity<DomainEvents> {
  id: string;
  matcherKind: string;
  properties: { [prop: string]: any };
}

export const NULL: RequestMatcher = {
  ...esre.NULL,
  id: '',
  matcherKind: '',
  properties: {},
};

export type DomainEvents =
  | rmc.RequestMatcherCreated
  ;

export const EVENT_HANDLER_MAP: esre.EntityEventHandlerMap<RequestMatcher, DomainEvents> = {
  [rmc.KIND]: (e, ev: rmc.RequestMatcherCreated) => {
    return {
      ...e,
      id: ev.id,
      matcherKind: ev.matcherKind,
      properties: ev.properties,
    };
  },
};

export const apply = esre.createApply(EVENT_HANDLER_MAP);
export const createFromEvents = esre.createFromEvents(NULL, EVENT_HANDLER_MAP);

export const create = (
  id: string,
  matcherKind: string,
  properties: { [prop: string]: any },
) => apply(NULL, rmc.create({ id, matcherKind, properties }));

const JOURNAL_NAME = 'request-matcher/Journal';

export const ofIdAsync = eser.entityOfIdAsync(JOURNAL_NAME, apply, createFromEvents);
export const saveAsync = eser.saveAsync<RequestMatcher, DomainEvents>(JOURNAL_NAME);
export const saveSnapshotAsync = eser.saveSnapshotAsync<RequestMatcher, DomainEvents>(JOURNAL_NAME);
