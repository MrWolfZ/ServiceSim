import { Diff } from '../../util';
import { Aggregate, AggregateMetadata, AggregateWithMetadata, DomainEvent } from '../api-infrastructure.types';
import { createCreateDataEvent, publishEvents } from '../event-log';
import { DocumentCollection } from './persistence/adapter';

export default function create<TAggregate extends Aggregate<TAggregate['@type']>, TEvent extends DomainEvent<TAggregate['@type'], TEvent['eventType']>>(
  aggregateType: TAggregate['@type'],
  collectionFactory: () => DocumentCollection<AggregateWithMetadata<TAggregate>>,
) {
  return async <TData extends Omit<TAggregate, keyof Aggregate<TAggregate['@type']>>>(
    data: TData & Exact<Omit<TAggregate, keyof Aggregate<TAggregate['@type']>>, TData>,
  ): Promise<TAggregate> => {
    const col = collectionFactory();

    const epoch = Date.now();

    const id = await col.generateId();

    const $metadata: AggregateMetadata<TAggregate, TEvent> = {
      aggregateType,
      createdOnEpoch: epoch,
      lastUpdatedOnEpoch: epoch,
      version: 1,
      isDeleted: false,
      changesSinceLastVersion: {} as Diff<TAggregate>,
      eventsSinceLastVersion: [],
    };

    const aggregateData: Aggregate<TAggregate['@type']> = {
      id,
      '@type': aggregateType,
    };

    const newAggregate: TAggregate = {
      ...aggregateData,
      ...data as any,
    };

    const newAggregateWithMedata: AggregateWithMetadata<TAggregate> = {
      ...newAggregate,
      $metadata,
    };

    await col.upsert(newAggregateWithMedata);

    await publishEvents(createCreateDataEvent(newAggregate, $metadata));

    return newAggregate;
  };
}
