import { DomainEvent } from './domain-event';

export interface EventSourcedRootEntity<TEvent extends DomainEvent = DomainEvent> {
  mutatingEvents: TEvent[];
  mutatedVersion: number;
  unmutatedVersion: number;
}

export const NULL: EventSourcedRootEntity<any> = {
  mutatingEvents: [],
  mutatedVersion: 1,
  unmutatedVersion: 0,
};

export type EntityEventHandler<T extends EventSourcedRootEntity<TEvent>, TEvent extends DomainEvent = DomainEvent> =
  (entity: T, event: TEvent) => T;

export function createFactory<T extends EventSourcedRootEntity<TEvent>, TEvent extends DomainEvent = DomainEvent>(
  factory: (rootEntity: EventSourcedRootEntity<TEvent>) => T,
  eventHandlerMap: EntityEventHandlerMap<T, TEvent>,
) {
  return (
    stream: TEvent[],
    streamVersion: number,
  ): T => {
    const rootEntity = {
      ...NULL,
      unmutatedVersion: streamVersion,
      mutatedVersion: streamVersion + 1,
    };

    const entity = factory(rootEntity);
    return stream.reduce((e, ev) => {
      const handler = eventHandlerMap[ev.kind];
      return handler(e, ev);
    }, entity);
  };
}

export interface EntityEventHandlerMap<T extends EventSourcedRootEntity<TEvent>, TEvent extends DomainEvent> {
  [eventKind: string]: EntityEventHandler<T, TEvent>;
}

export function createApply<T extends EventSourcedRootEntity<TEvent>, TEvent extends DomainEvent>(
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
    }, event);
  };
}
