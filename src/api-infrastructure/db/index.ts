import { Observable, Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { DomainEvent, DomainEventHandlerMap, RootEntity } from '../api-infrastructure.types';
import create from './create';
import delete$ from './delete';
import patch from './patch';
import query from './query';

const inMemoryDb: { [entityType: string]: { [id: string]: any[] } } = {};

const allEventsSubject = new Subject<DomainEvent<any, any>>();

function getEntityCollection<TEntity>(entityType: string): { [id: string]: (TEntity & { $metadata: any })[] } {
  return inMemoryDb[entityType] = inMemoryDb[entityType] || {};
}

function repository<TEntityType extends string, TEntity extends RootEntity>(
  entityType: TEntityType,
) {
  return {
    create: create<TEntityType, TEntity>(entityType, 'Default', getEntityCollection),
    patch: patch<TEntityType, TEntity>(entityType, 'Default', getEntityCollection),
    delete: delete$<TEntityType, TEntity>(entityType, 'Default', getEntityCollection),
    async dropAll() { inMemoryDb[entityType] = {}; },

    query: query<TEntityType, TEntity>(entityType, 'Default', getEntityCollection),
  };
}

function versionedRepository<TEntityType extends string, TEntity extends RootEntity>(
  entityType: TEntityType,
) {
  return {
    create: create<TEntityType, TEntity>(entityType, 'Versioned', getEntityCollection),
    patch: patch<TEntityType, TEntity>(entityType, 'Versioned', getEntityCollection),
    delete: delete$<TEntityType, TEntity>(entityType, 'Versioned', getEntityCollection),
    async dropAll() { inMemoryDb[entityType] = {}; },

    query: query<TEntityType, TEntity>(entityType, 'Versioned', getEntityCollection),
  };
}

function eventDrivenRepository<TEntityType extends string, TEntity extends RootEntity, TEvent extends DomainEvent<TEntityType, TEvent['eventType']>>(
  entityType: TEntityType,
  eventHandlers: DomainEventHandlerMap<TEntityType, TEntity, TEvent>,
) {
  return {
    create: create<TEntityType, TEntity>(entityType, 'EventDriven', getEntityCollection),
    patch: patch<TEntityType, TEntity, TEvent>(entityType, 'EventDriven', getEntityCollection, eventHandlers, allEventsSubject),
    delete: delete$<TEntityType, TEntity>(entityType, 'EventDriven', getEntityCollection),
    async dropAll() { inMemoryDb[entityType] = {}; },

    query: query<TEntityType, TEntity, TEvent>(entityType, 'EventDriven', getEntityCollection),
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

function getEventStream<TEvent extends DomainEvent<any, TEvent['eventType']> = DomainEvent<any, TEvent['eventType']>>(
  eventKinds: TEvent['eventType'][],
): Observable<TEvent> {
  return allEventsSubject.pipe(
    filter(ev => eventKinds.indexOf(ev.eventType as TEvent['eventType']) >= 0),
    map(t => t as TEvent),
  );
}
