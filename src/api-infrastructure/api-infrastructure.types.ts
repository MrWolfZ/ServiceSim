export interface DomainEventData<TKind extends string = string> {
  kind: TKind;
  occurredOnEpoch: number;
  eventVersion: number;
}

export interface EventSourcedRootEntityData<TEvent extends DomainEventData<TEvent['kind']>> {
  id: string;
  mutatingEvents: TEvent[];
  mutatedVersion: number;
  unmutatedVersion: number;
}

export type EntityEventHandler<TEvent extends DomainEventData<TEvent['kind']> = DomainEventData<TEvent['kind']>> = (event: TEvent) => void;

export type EventOfKind<TEvent, TKind extends string> = TEvent extends DomainEventData<TKind> ? TEvent : never;

export type EventHandlerMap<TEvent extends DomainEventData> = {
  [eventKind in TEvent['kind']]: EntityEventHandler<EventOfKind<TEvent, eventKind>>;
};
