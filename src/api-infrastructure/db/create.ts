import { keys } from '../../util/util';
import { Aggregate, AggregateMetadata, EventDrivenAggregateMetadata, VersionedAggregateMetadata } from '../api-infrastructure.types';
import { getMetadataOfType } from './util';

export default function create<TAggregateType extends string, TAggregate extends Aggregate>(
  aggregateType: TAggregateType,
  metadataType: 'Default' | 'Versioned' | 'EventDriven',
  getAggregateCollection: <TAggregate>(aggregateType: string) => { [id: string]: (TAggregate & { $metadata: any })[] },
) {
  return async <TData extends Omit<TAggregate, keyof Aggregate>>(
    data: TData & Exact<Omit<TAggregate, keyof Aggregate>, TData>,
  ): Promise<TAggregate> => {
    const col = getAggregateCollection<TAggregate>(aggregateType);

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
      changesSinceLastVersion: {},
    };

    const $eventDrivenMetadata: EventDrivenAggregateMetadata<TAggregateType, TAggregate, any> = {
      ...$versionedMetadata,
      eventsSinceLastVersion: [],
    };

    const id = `${aggregateType}/${keys(col).length + 1}`;
    const $metadata = getMetadataOfType(metadataType, $aggregateMetadata, $versionedMetadata, $eventDrivenMetadata);

    const newAggregate: TAggregate & { $metadata: any } = {
      id,
      $metadata,
      ...data as any,
    };

    col[id] = [newAggregate];
    return newAggregate;
  };
}
