import { Diff } from '../../util';
import {
  Aggregate,
  AggregateMetadata,
  DomainEvent,
  DomainEventHandlerMap,
  EventDrivenAggregateMetadata,
  EventOfType,
  VersionedAggregateMetadata,
} from '../api-infrastructure.types';
import { createCreateDataEvent, publishEvents } from '../event-log';
import { DocumentCollection } from './persistence/adapter';
import { getMetadataOfType } from './util';

export default function create<TAggregate extends Aggregate<TAggregate['@type']>>(
  aggregateType: TAggregate['@type'],
  metadataType: 'Default' | 'Versioned',
  collectionFactory: () => DocumentCollection<TAggregate & { $metadata: any }>,
)
  : <TData extends Omit<TAggregate, keyof Aggregate<TAggregate['@type']>>>(
    data: TData & Exact<Omit<TAggregate, keyof Aggregate<TAggregate['@type']>>, TData>,
  ) => Promise<TAggregate>;

export default function create<TAggregate extends Aggregate<TAggregate['@type']>, TEvent extends DomainEvent<TAggregate['@type'], TEvent['eventType']>>(
  aggregateType: TAggregate['@type'],
  metadataType: 'EventDriven',
  collectionFactory: () => DocumentCollection<TAggregate & { $metadata: any }>,
  eventHandlers: DomainEventHandlerMap<TAggregate, TEvent>,
)
  : <TData extends Omit<TAggregate, keyof Aggregate<TAggregate['@type']>>>(
    dataOrEvents: (TData & Exact<Omit<TAggregate, keyof Aggregate<TAggregate['@type']>>, TData>) | (Omit<TEvent, 'aggregateId'>)[],
  ) => Promise<TAggregate>;

export default function create<TAggregate extends Aggregate<TAggregate['@type']>, TEvent extends DomainEvent<TAggregate['@type'], TEvent['eventType']>>(
  aggregateType: TAggregate['@type'],
  metadataType: 'Default' | 'Versioned' | 'EventDriven',
  collectionFactory: () => DocumentCollection<TAggregate & { $metadata: any }>,
  eventHandlers?: DomainEventHandlerMap<TAggregate, TEvent>,
) {
  return async <TData extends Omit<TAggregate, keyof Aggregate<TAggregate['@type']>>>(
    dataOrEvents: (TData & Exact<Omit<TAggregate, keyof Aggregate<TAggregate['@type']>>, TData>) | (Omit<TEvent, 'aggregateId'>)[],
  ): Promise<TAggregate> => {
    const col = collectionFactory();

    const epoch = Date.now();

    const $aggregateMetadata: AggregateMetadata<TAggregate['@type']> = {
      aggregateType,
      createdOnEpoch: epoch,
      lastUpdatedOnEpoch: epoch,
    };

    const $versionedMetadata: VersionedAggregateMetadata<TAggregate> = {
      ...$aggregateMetadata,
      version: 1,
      isDeleted: false,
      changesSinceLastVersion: {} as Diff<TAggregate>,
    };

    const $eventDrivenMetadata: EventDrivenAggregateMetadata<TAggregate, any> = {
      ...$versionedMetadata,
      eventsSinceLastVersion: [],
    };

    const id = await col.generateId();
    const $metadata = getMetadataOfType(metadataType, $aggregateMetadata, $versionedMetadata, $eventDrivenMetadata);

    const aggregateData: Aggregate<TAggregate['@type']> = {
      id,
      '@type': aggregateType,
    };

    const customData = Array.isArray(dataOrEvents) ? {} : dataOrEvents;

    let newAggregate: TAggregate = {
      ...aggregateData,
      ...customData as any,
    };

    const eventsWithId: TEvent[] = (Array.isArray(dataOrEvents) ? dataOrEvents : []).map(evt => ({ ...evt as TEvent, aggregateId: id }));

    if (metadataType === 'EventDriven') {
      newAggregate = eventsWithId.reduce((e, evt) => {
        const eventHandler = eventHandlers![evt.eventType];
        return eventHandler(e, evt as EventOfType<TEvent, typeof evt.eventType>);
      }, newAggregate);
    }

    const newAggregateWithMedata: TAggregate & { $metadata: any } = {
      ...newAggregate,
      $metadata,
    };

    await col.addVersion(id, newAggregateWithMedata);

    await publishEvents(createCreateDataEvent(newAggregate, $metadata));
    await publishEvents(...eventsWithId);

    return newAggregate;
  };
}
