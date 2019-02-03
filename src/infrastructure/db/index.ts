import { Aggregate, DomainEvent, DomainEventHandlerMap, EventOfType } from 'src/domain/infrastructure/ddd';
import { createDomainEvent } from 'src/domain/infrastructure/events';
import { failure } from 'src/util';
import create from './create';
import delete$ from './delete';
import patch from './patch';
import { PersistenceAdapter } from './persistence';
import query from './query';

let adapter: PersistenceAdapter | undefined;

function safeAdapter() {
  if (!adapter) {
    throw failure(`DB adapter must be set`);
  }

  return adapter;
}

export async function initializeDB(options: { adapter: PersistenceAdapter }) {
  adapter = options.adapter;

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
  return anyRepository<TAggregate, never>(aggregateType, false, {});
}

export function versionedRepository<TAggregate extends Aggregate<TAggregate['@type']>>(
  aggregateType: TAggregate['@type'],
) {
  return anyRepository<TAggregate, never>(aggregateType, true, {});
}

export function eventDrivenRepository<
  TAggregate extends Aggregate<TAggregate['@type']>,
  TEvent extends DomainEvent<TAggregate['@type'], TEvent['eventType']>,
  >(
    aggregateType: TAggregate['@type'],
    eventHandlers: DomainEventHandlerMap<TAggregate, TEvent>,
) {
  return anyRepository<TAggregate, TEvent>(aggregateType, true, eventHandlers);
}

export function anyRepository<
  TAggregate extends Aggregate<TAggregate['@type']>,
  TEvent extends DomainEvent<TAggregate['@type'], TEvent['eventType']>,
  >(
    aggregateType: TAggregate['@type'],
    keepRevisions: boolean,
    eventHandlers: DomainEventHandlerMap<TAggregate, TEvent>,
) {
  verifyAggregateType(aggregateType);

  const collectionFactory = () => safeAdapter().getCollection<TAggregate & { $metadata: any }>({
    documentType: aggregateType,
    keepRevisions,
  });

  return {
    create: create<TAggregate, TEvent>(aggregateType, collectionFactory),
    patch: patch<TAggregate, TEvent>(aggregateType, collectionFactory, eventHandlers),
    delete: delete$<TAggregate>(aggregateType, collectionFactory),
    dropAll: () => collectionFactory().dropAll(),

    query: query<TAggregate, TEvent>(aggregateType, collectionFactory),

    createDomainEvent<
      TEventType extends TEvent['eventType'],
      TCustomProps extends Omit<EventOfType<TEvent, TEventType>, keyof DomainEvent<TAggregate['@type'], TEventType>>,
      >(
        eventType: TEventType,
        aggregateId: string,
        // tslint:disable-next-line:max-line-length
        customProps: TCustomProps & Exact<Omit<EventOfType<TEvent, TEventType>, keyof DomainEvent<TAggregate['@type'], TEventType>>, TCustomProps>,
    ): Omit<TEvent, 'aggregateId'> {
      return createDomainEvent<TEvent, TCustomProps>(eventType, aggregateType, aggregateId, customProps);
    },
  };
}

export async function dropDB() {
  await safeAdapter().drop();
}