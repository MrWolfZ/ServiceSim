import { assertNever } from '../../util/assert';
import { failure } from '../../util/result-monad';
import {
  Aggregate,
  AggregateMetadata,
  EventDrivenAggregateMetadata,
  VersionedAggregateMetadata,
} from '../api-infrastructure.types';
import { DocumentCollection } from './adapters';
import { getMetadataOfType } from './util';

export default function delete$<TAggregateType extends string, TAggregate extends Aggregate>(
  aggregateType: TAggregateType,
  metadataType: 'Default',
  col: DocumentCollection<TAggregate & { $metadata: any }>,
): (id: string) => Promise<void>;

export default function delete$<TAggregateType extends string, TAggregate extends Aggregate>(
  aggregateType: TAggregateType,
  metadataType: 'Versioned' | 'EventDriven',
  col: DocumentCollection<TAggregate & { $metadata: any }>,
): (id: string, expectedVersion: number) => Promise<void>;

export default function delete$<TAggregateType extends string, TAggregate extends Aggregate>(
  aggregateType: TAggregateType,
  metadataType: 'Default' | 'Versioned' | 'EventDriven',
  col: DocumentCollection<TAggregate & { $metadata: any }>,
) {
  return async (id: string, expectedVersion = -1) => {
    const latestAggregate = await col.getLatestVersionById(id);

    if (!latestAggregate) {
      throw failure(`patch failed: aggregate with id ${id} of type ${aggregateType} does not exist`);
    }

    const actualVersion = (latestAggregate.$metadata as VersionedAggregateMetadata<any, any>).version;

    if (expectedVersion !== -1 && actualVersion !== expectedVersion) {
      // tslint:disable-next-line:max-line-length
      throw failure(`patch failed: aggregate with id ${id} of type ${aggregateType} does not match the expected version (expected: ${expectedVersion}, actual: ${actualVersion})`);
    }

    if ((latestAggregate.$metadata as VersionedAggregateMetadata<any, any>).isDeleted) {
      throw failure(`patch failed: aggregate with id ${id} of type ${aggregateType} is deleted`);
    }

    const epoch = Date.now();

    const $aggregateMetadata: AggregateMetadata<TAggregateType> = {
      ...latestAggregate.$metadata,
      lastUpdatedOnEpoch: epoch,
    };

    const $versionedMetadata: VersionedAggregateMetadata<TAggregateType, TAggregate> = {
      ...latestAggregate.$metadata,
      ...$aggregateMetadata,
      version: actualVersion + 1,
      changesSinceLastVersion: {},
      isDeleted: true,
    };

    const $eventDrivenMetadata: EventDrivenAggregateMetadata<TAggregateType, TAggregate, any> = {
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
  };
}
