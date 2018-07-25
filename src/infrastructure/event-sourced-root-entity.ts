import { DomainEvent } from './domain-event';

export interface EntityConstructor<T extends EventSourcedRootEntity<TEvent>, TEvent extends DomainEvent<TEvent['kind']> = DomainEvent> {
  new(...args: any[]): T;
}

export abstract class EventSourcedRootEntity<TEvent extends DomainEvent<TEvent['kind']> = DomainEvent> {
  id = '';
  mutatingEvents: TEvent[] = [];
  mutatedVersion = 1;
  unmutatedVersion = 0;

  protected apply(event: TEvent) {
    this.mutatingEvents.push(event);
    return this.dispatch(event);
  }

  private dispatch(event: TEvent) {
    const handler = this.EVENT_HANDLERS[event.kind];
    handler(event as EventOfKind<TEvent, TEvent['kind']>);
    return this;
  }

  abstract EVENT_HANDLERS: EventHandlerMap<TEvent>;

  protected getSnapshotValue(): any {
    throw new Error('snapshots not supported');
  }

  createSnapshot(): any {
    return {
      ...this.getSnapshotValue(),
      id: this.id,
    };
  }

  static fromEventsBase<T extends EventSourcedRootEntity<TEvent>, TEvent extends DomainEvent<TEvent['kind']>>(
    cons: EntityConstructor<T, TEvent>,
  ) {
    return (
      stream: TEvent[],
      streamVersion: number,
      snapshot: any | undefined,
    ): T => {
      const entity = new cons();

      if (snapshot) {
        Object.assign(entity, snapshot);
      }

      stream.forEach(ev => entity.dispatch(ev));
      entity.mutatingEvents = [];
      entity.unmutatedVersion = streamVersion;
      entity.mutatedVersion = streamVersion + 1;
      return entity;
    };
  }
}

export type EntityEventHandler<TEvent extends DomainEvent<TEvent['kind']> = DomainEvent> = (event: TEvent) => void;

export type EventOfKind<TEvent, TKind extends string> = TEvent extends DomainEvent<TKind> ? TEvent : never;

export type EventHandlerMap<TEvent extends DomainEvent> = {
  [eventKind in TEvent['kind']]: EntityEventHandler<EventOfKind<TEvent, eventKind>>;
};
