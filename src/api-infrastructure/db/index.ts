import { failure } from '../../util';
import { Aggregate, DomainEvent, DomainEventHandlerMap, DomainEventOfType } from '../api-infrastructure.types';
import { createDomainEvent } from '../event-log';
import create from './create';
import delete$ from './delete';
import patch from './patch';
import { PersistenceAdapter } from './persistence/adapter';
import { inMemoryPersistenceAdapter } from './persistence/in-memory';
import query from './query';

let adapter: PersistenceAdapter = inMemoryPersistenceAdapter;

export async function initializeDB(options: { adapter?: PersistenceAdapter } = {}) {
  if (options.adapter) {
    adapter = options.adapter;
  }

  if (adapter.initialize) {
    await adapter.initialize();
  }
}

function verifyAggregateType(aggregateType: string) {
  if (!aggregateType) {
    throw failure('aggregate type must be a non-empty string');
  }

  if (!/[a-zA-Z0-9-_]+/g.test(aggregateType)) {
    throw failure(`aggregate type must only consist of alphanumeric characters, dashes, and underscores; got ${aggregateType}`);
  }
}

export function repository<TAggregate extends Aggregate<TAggregate['@type']>>(
  aggregateType: TAggregate['@type'],
) {
  verifyAggregateType(aggregateType);

  const collectionFactory = () => adapter.getCollection<TAggregate & { $metadata: any }>(aggregateType);

  return {
    create: create<TAggregate>(aggregateType, 'Default', collectionFactory),
    patch: patch<TAggregate>(aggregateType, 'Default', collectionFactory),
    delete: delete$<TAggregate>(aggregateType, 'Default', collectionFactory),
    dropAll: () => collectionFactory().dropAll(),

    query: query<TAggregate>(aggregateType, 'Default', collectionFactory),
  };
}

export function versionedRepository<TAggregate extends Aggregate<TAggregate['@type']>>(
  aggregateType: TAggregate['@type'],
) {
  verifyAggregateType(aggregateType);

  const collectionFactory = () => adapter.getCollection<TAggregate & { $metadata: any }>(aggregateType);

  return {
    create: create<TAggregate>(aggregateType, 'Versioned', collectionFactory),
    patch: patch<TAggregate>(aggregateType, 'Versioned', collectionFactory),
    delete: delete$<TAggregate>(aggregateType, 'Versioned', collectionFactory),
    dropAll: () => collectionFactory().dropAll(),

    query: query<TAggregate>(aggregateType, 'Versioned', collectionFactory),
  };
}

export function eventDrivenRepository<
  TAggregate extends Aggregate<TAggregate['@type']>,
  TEvent extends DomainEvent<TAggregate['@type'], TEvent['eventType']>,
  >(
    aggregateType: TAggregate['@type'],
    eventHandlers: DomainEventHandlerMap<TAggregate, TEvent>,
) {
  verifyAggregateType(aggregateType);

  const collectionFactory = () => adapter.getCollection<TAggregate & { $metadata: any }>(aggregateType);

  return {
    create: create<TAggregate>(aggregateType, 'EventDriven', collectionFactory),
    patch: patch<TAggregate, TEvent>(aggregateType, 'EventDriven', collectionFactory, eventHandlers),
    delete: delete$<TAggregate>(aggregateType, 'EventDriven', collectionFactory),
    dropAll: () => collectionFactory().dropAll(),

    query: query<TAggregate, TEvent>(aggregateType, 'EventDriven', collectionFactory),

    createDomainEvent<
      TEventType extends TEvent['eventType'],
      TCustomProps extends Omit<DomainEventOfType<TEvent, TEventType>, Exclude<keyof DomainEvent<TAggregate['@type'], TEventType>, 'aggregateId'>>,
      >(
        eventType: TEventType,
        // tslint:disable-next-line:max-line-length
        customProps: TCustomProps & Exact<Omit<DomainEventOfType<TEvent, TEventType>, Exclude<keyof DomainEvent<TAggregate['@type'], TEventType>, 'aggregateId'>>, TCustomProps>,
    ): TEvent {
      return createDomainEvent<TEvent, TCustomProps>(eventType, aggregateType, customProps);
    },
  };
}
