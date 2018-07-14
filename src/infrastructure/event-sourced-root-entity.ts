import { DomainEvent } from './domain-event';

export interface EventSourcedRootEntity<TEvent extends DomainEvent<TEvent['kind']> = DomainEvent> {
  id: string;
  mutatingEvents: TEvent[];
  mutatedVersion: number;
  unmutatedVersion: number;
}

export const NULL: EventSourcedRootEntity<any> = {
  id: '',
  mutatingEvents: [],
  mutatedVersion: 1,
  unmutatedVersion: 0,
};

export type EntityEventHandler<T extends EventSourcedRootEntity<TEvent>, TEvent extends DomainEvent<TEvent['kind']> = DomainEvent> =
  (entity: T, event: TEvent) => T;

export const createFromEvents = <T extends EventSourcedRootEntity<TEvent>, TEvent extends DomainEvent<TEvent['kind']> = DomainEvent>(
  nullEntity: T,
  eventHandlerMap: EntityEventHandlerMap<T, TEvent>,
) => (
  stream: TEvent[],
  streamVersion: number,
  ): T => {
    const entity = stream.reduce((e, ev) => {
      const handler = eventHandlerMap[ev.kind];
      return handler(e, ev as EventOfKind<TEvent, TEvent['kind']>);
    }, nullEntity);

    entity.mutatingEvents = [];
    entity.unmutatedVersion = streamVersion;
    entity.mutatedVersion = streamVersion + 1;

    return entity;
  };

export type EventOfKind<TEvent, TKind extends string> = TEvent extends DomainEvent<TKind> ? TEvent : never;

export type EntityEventHandlerMap<T extends EventSourcedRootEntity<any>, TEvent extends DomainEvent> = {
  [eventKind in TEvent['kind']]: EntityEventHandler<T, EventOfKind<TEvent, eventKind>>;
};

export function createApply<T extends EventSourcedRootEntity<TEvent>, TEvent extends DomainEvent<TEvent['kind']>>(
  eventHandlerMap: EntityEventHandlerMap<T, TEvent>,
): EntityEventHandler<T, TEvent> {
  return (entity, event) => {
    const handler = eventHandlerMap[event.kind];
    return handler({
      ...(entity as any),
      mutatingEvents: [
        ...entity.mutatingEvents,
        event,
      ],
    }, event as EventOfKind<TEvent, TEvent['kind']>);
  };
}
