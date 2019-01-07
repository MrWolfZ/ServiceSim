import { Observable, Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Aggregate, DomainEvent, DomainEventHandlerMap, DomainEventOfType } from '../api-infrastructure.types';
import create from './create';
import delete$ from './delete';
import patch from './patch';
import query from './query';

const inMemoryDb: { [aggregateType: string]: { [id: string]: any[] } } = {};

const allEventsSubject = new Subject<DomainEvent<any, any>>();

function getAggregateCollection<TAggregate>(aggregateType: string): { [id: string]: (TAggregate & { $metadata: any })[] } {
  return inMemoryDb[aggregateType] = inMemoryDb[aggregateType] || {};
}

function repository<TAggregateType extends string, TAggregate extends Aggregate>(
  aggregateType: TAggregateType,
) {
  return {
    create: create<TAggregateType, TAggregate>(aggregateType, 'Default', getAggregateCollection),
    patch: patch<TAggregateType, TAggregate>(aggregateType, 'Default', getAggregateCollection),
    delete: delete$<TAggregateType>(aggregateType, 'Default', getAggregateCollection),
    async dropAll() { inMemoryDb[aggregateType] = {}; },

    query: query<TAggregateType, TAggregate>(aggregateType, 'Default', getAggregateCollection),
  };
}

function versionedRepository<TAggregateType extends string, TAggregate extends Aggregate>(
  aggregateType: TAggregateType,
) {
  return {
    create: create<TAggregateType, TAggregate>(aggregateType, 'Versioned', getAggregateCollection),
    patch: patch<TAggregateType, TAggregate>(aggregateType, 'Versioned', getAggregateCollection),
    delete: delete$<TAggregateType>(aggregateType, 'Versioned', getAggregateCollection),
    async dropAll() { inMemoryDb[aggregateType] = {}; },

    query: query<TAggregateType, TAggregate>(aggregateType, 'Versioned', getAggregateCollection),
  };
}

function eventDrivenRepository<TAggregateType extends string, TAggregate extends Aggregate, TEvent extends DomainEvent<TAggregateType, TEvent['eventType']>>(
  aggregateType: TAggregateType,
  eventHandlers: DomainEventHandlerMap<TAggregateType, TAggregate, TEvent>,
) {
  return {
    create: create<TAggregateType, TAggregate>(aggregateType, 'EventDriven', getAggregateCollection),
    patch: patch<TAggregateType, TAggregate, TEvent>(aggregateType, 'EventDriven', getAggregateCollection, eventHandlers, allEventsSubject),
    delete: delete$<TAggregateType>(aggregateType, 'EventDriven', getAggregateCollection),
    async dropAll() { inMemoryDb[aggregateType] = {}; },

    query: query<TAggregateType, TAggregate, TEvent>(aggregateType, 'EventDriven', getAggregateCollection),

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
  async initialize() {
    // nothing to do

    // TODO: initialize connection to data storage
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
