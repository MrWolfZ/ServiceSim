import { Observable, Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Aggregate, DomainEvent, DomainEventHandlerMap, DomainEventOfType } from '../api-infrastructure.types';
import { PersistenceAdapter } from './adapters';
import { inMemoryPersistenceAdapter } from './adapters/in-memory';
import create from './create';
import delete$ from './delete';
import patch from './patch';
import query from './query';

const allEventsSubject = new Subject<DomainEvent<any, any>>();

let adapter: PersistenceAdapter = inMemoryPersistenceAdapter;

function repository<TAggregateType extends string, TAggregate extends Aggregate>(
  aggregateType: TAggregateType,
) {
  const col = adapter.getCollection<TAggregate & { $metadata: any }>(aggregateType);

  return {
    create: create<TAggregateType, TAggregate>(aggregateType, 'Default', col),
    patch: patch<TAggregateType, TAggregate>(aggregateType, 'Default', col),
    delete: delete$<TAggregateType, TAggregate>(aggregateType, 'Default', col),
    async dropAll() { await col.dropAll(); },

    query: query<TAggregateType, TAggregate>(aggregateType, 'Default', col),
  };
}

function versionedRepository<TAggregateType extends string, TAggregate extends Aggregate>(
  aggregateType: TAggregateType,
) {
  const col = adapter.getCollection<TAggregate & { $metadata: any }>(aggregateType);

  return {
    create: create<TAggregateType, TAggregate>(aggregateType, 'Versioned', col),
    patch: patch<TAggregateType, TAggregate>(aggregateType, 'Versioned', col),
    delete: delete$<TAggregateType, TAggregate>(aggregateType, 'Versioned', col),
    async dropAll() { await col.dropAll(); },

    query: query<TAggregateType, TAggregate>(aggregateType, 'Versioned', col),
  };
}

function eventDrivenRepository<TAggregateType extends string, TAggregate extends Aggregate, TEvent extends DomainEvent<TAggregateType, TEvent['eventType']>>(
  aggregateType: TAggregateType,
  eventHandlers: DomainEventHandlerMap<TAggregateType, TAggregate, TEvent>,
) {
  const col = adapter.getCollection<TAggregate & { $metadata: any }>(aggregateType);

  return {
    create: create<TAggregateType, TAggregate>(aggregateType, 'EventDriven', col),
    patch: patch<TAggregateType, TAggregate, TEvent>(aggregateType, 'EventDriven', col, eventHandlers, allEventsSubject),
    delete: delete$<TAggregateType, TAggregate>(aggregateType, 'EventDriven', col),
    async dropAll() { await col.dropAll(); },

    query: query<TAggregateType, TAggregate, TEvent>(aggregateType, 'EventDriven', col),

    createDomainEvent<
      TEventType extends TEvent['eventType'],
      TCustomProps extends Omit<DomainEventOfType<TEvent, TEventType>, Exclude<keyof DomainEvent<TAggregateType, TEventType>, 'aggregateId'>>,
      >(
        eventType: TEventType,
        // tslint:disable-next-line:max-line-length
        customProps: TCustomProps & Exact<Omit<DomainEventOfType<TEvent, TEventType>, Exclude<keyof DomainEvent<TAggregateType, TEventType>, 'aggregateId'>>, TCustomProps>,
    ): TEvent {
      const domainEventProps: Omit<DomainEvent<TAggregateType, TEventType>, 'aggregateId'> = {
        aggregateType,
        eventType,
        occurredOnEpoch: Date.now(),
      };

      return {
        ...domainEventProps,
        ...customProps as any,
      };
    },
  };
}

export const DB = {
  async initialize(options: { adapter?: PersistenceAdapter } = {}) {
    if (options.adapter) {
      adapter = options.adapter;
    }

    if (adapter.initialize) {
      await adapter.initialize();
    }
  },

  repository,
  versionedRepository,
  eventDrivenRepository,

  getEventStream,
};

function getEventStream<
  TAggregateType extends string,
  TEvent extends DomainEvent<TAggregateType, TEvent['eventType']> = DomainEvent<TAggregateType, TEvent['eventType']>,
  >(
    aggregateType: TAggregateType,
    ...eventTypes: TEvent['eventType'][]
  ): Observable<TEvent> {
  return allEventsSubject.pipe(
    filter(ev => ev.aggregateType === aggregateType && eventTypes.indexOf(ev.eventType as TEvent['eventType']) >= 0),
    map(t => t as TEvent),
  );
}
