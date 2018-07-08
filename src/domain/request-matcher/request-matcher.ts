import * as esre from '../../infrastructure/event-sourced-root-entity';
import * as rmc from './request-matcher-created';

export interface RequestMatcher extends esre.EventSourcedRootEntity {
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

export function create(
  id: string,
  matcherKind: string,
  properties: { [prop: string]: any },
): RequestMatcher {
  return apply(NULL, rmc.create(id, matcherKind, properties));
}

export function createFromEvents(
  stream: DomainEvents[],
  streamVersion: number,
) {
  return esre.createFactory<RequestMatcher, DomainEvents>(
    base => ({
      ...NULL,
      ...base,
    }),
    EVENT_HANDLER_MAP,
  )(stream, streamVersion);
}
