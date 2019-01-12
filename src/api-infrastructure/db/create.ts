import { Diff } from '../../util';
import { Aggregate, AggregateMetadata, EventDrivenAggregateMetadata, VersionedAggregateMetadata } from '../api-infrastructure.types';
import { DocumentCollection } from './adapters';
import { getMetadataOfType } from './util';

export default function create<TAggregateType extends string, TAggregate extends Aggregate>(
  aggregateType: TAggregateType,
  metadataType: 'Default' | 'Versioned' | 'EventDriven',
  collectionFactory: () => DocumentCollection<TAggregate & { $metadata: any }>,
) {
  return async <TData extends Omit<TAggregate, keyof Aggregate>>(
    data: TData & Exact<Omit<TAggregate, keyof Aggregate>, TData>,
  ): Promise<TAggregate> => {
    const col = collectionFactory();

    const epoch = Date.now();

    const $aggregateMetadata: AggregateMetadata<TAggregateType> = {
      aggregateType,
      createdOnEpoch: epoch,
      lastUpdatedOnEpoch: epoch,
    };

    const $versionedMetadata: VersionedAggregateMetadata<TAggregateType, TAggregate> = {
      ...$aggregateMetadata,
      version: 1,
      isDeleted: false,
      changesSinceLastVersion: {} as Diff<TAggregate>,
    };

    const $eventDrivenMetadata: EventDrivenAggregateMetadata<TAggregateType, TAggregate, any> = {
      ...$versionedMetadata,
      eventsSinceLastVersion: [],
    };

    const id = await col.generateId();
    const $metadata = getMetadataOfType(metadataType, $aggregateMetadata, $versionedMetadata, $eventDrivenMetadata);

    const newAggregate: TAggregate & { $metadata: any } = {
      id,
      $metadata,
      ...data as any,
    };

    await col.addVersion(id, newAggregate);
    return newAggregate;
  };
}
