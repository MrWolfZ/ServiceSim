import { Diff } from '../../util';
import { Aggregate, AggregateMetadata, EventDrivenAggregateMetadata, VersionedAggregateMetadata } from '../api-infrastructure.types';
import { DocumentCollection } from './adapters';
import { getMetadataOfType } from './util';

export default function create<TAggregate extends Aggregate<TAggregate['@type']>>(
  aggregateType: TAggregate['@type'],
  metadataType: 'Default' | 'Versioned' | 'EventDriven',
  collectionFactory: () => DocumentCollection<TAggregate & { $metadata: any }>,
) {
  return async <TData extends Omit<TAggregate, keyof Aggregate<TAggregate['@type']>>>(
    data: TData & Exact<Omit<TAggregate, keyof Aggregate<TAggregate['@type']>>, TData>,
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

    const aggregateData: Aggregate<TAggregate['@type']> & { $metadata: any } = {
      id,
      '@type': aggregateType,
      $metadata,
    };

    const newAggregate: TAggregate & { $metadata: any } = {
      ...aggregateData,
      ...data as any,
    };

    await col.addVersion(id, newAggregate);
    return newAggregate;
  };
}
