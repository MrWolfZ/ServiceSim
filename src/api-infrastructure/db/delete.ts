import { assertNever, failure } from '../../util';
import { Aggregate, AggregateMetadata, EventDrivenAggregateMetadata, VersionedAggregateMetadata } from '../api-infrastructure.types';
import { createDeleteDataEvent, publishEvents } from '../event-log';
import { DocumentCollection } from './adapters';
import { getMetadataOfType } from './util';

export default function delete$<TAggregate extends Aggregate<TAggregate['@type']>>(
  aggregateType: TAggregate['@type'],
  metadataType: 'Default',
  collectionFactory: () => DocumentCollection<TAggregate & { $metadata: any }>,
): (id: string) => Promise<void>;

export default function delete$<TAggregate extends Aggregate<TAggregate['@type']>>(
  aggregateType: TAggregate['@type'],
  metadataType: 'Versioned' | 'EventDriven',
  collectionFactory: () => DocumentCollection<TAggregate & { $metadata: any }>,
): (id: string, expectedVersion: number) => Promise<void>;

export default function delete$<TAggregate extends Aggregate<TAggregate['@type']>>(
  aggregateType: TAggregate['@type'],
  metadataType: 'Default' | 'Versioned' | 'EventDriven',
  collectionFactory: () => DocumentCollection<TAggregate & { $metadata: any }>,
) {
  return async (id: string, expectedVersion = -1) => {
    const col = collectionFactory();

    const latestAggregate = await col.getLatestVersionById(id);

    if (!latestAggregate) {
      throw failure(`patch failed: aggregate with id ${id} of type ${aggregateType} does not exist`);
    }

    const actualVersion = (latestAggregate.$metadata as VersionedAggregateMetadata<any>).version;

    if (expectedVersion !== -1 && actualVersion !== expectedVersion) {
      // tslint:disable-next-line:max-line-length
      throw failure(`patch failed: aggregate with id ${id} of type ${aggregateType} does not match the expected version (expected: ${expectedVersion}, actual: ${actualVersion})`);
    }

    if ((latestAggregate.$metadata as VersionedAggregateMetadata<any>).isDeleted) {
      throw failure(`patch failed: aggregate with id ${id} of type ${aggregateType} is deleted`);
    }

    const epoch = Date.now();

    const $aggregateMetadata: AggregateMetadata<TAggregate['@type']> = {
      ...latestAggregate.$metadata,
      lastUpdatedOnEpoch: epoch,
    };

    const $versionedMetadata: VersionedAggregateMetadata<TAggregate> = {
      ...latestAggregate.$metadata,
      ...$aggregateMetadata,
      version: actualVersion + 1,
      changesSinceLastVersion: {},
      isDeleted: true,
    };

    const $eventDrivenMetadata: EventDrivenAggregateMetadata<TAggregate, any> = {
      ...latestAggregate.$metadata,
      ...$versionedMetadata,
      eventsSinceLastVersion: [],
    };

    const $metadata = getMetadataOfType(metadataType, $aggregateMetadata, $versionedMetadata, $eventDrivenMetadata);

    const updatedAggregate = {
      ...latestAggregate,
      $metadata,
    };

    switch (metadataType) {
      case 'Default':
        await col.delete(id);
        break;

      case 'Versioned':
      case 'EventDriven':
        await col.addVersion(id, updatedAggregate);
        break;

      default:
        assertNever(metadataType);
        break;
    }

    await publishEvents(createDeleteDataEvent(aggregateType, id));
  };
}
