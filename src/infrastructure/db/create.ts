import { Aggregate, AggregateMetadata, AggregateWithMetadata, DomainEvent } from 'src/domain/infrastructure/ddd';
import { Diff } from 'src/domain/infrastructure/diff';
import { createCreateDataEvent } from 'src/domain/infrastructure/events';
import { publish } from '../bus';
import { DocumentCollection } from './persistence';

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

    await publish(createCreateDataEvent(newAggregate));

    return newAggregate;
  };
}
