import { Aggregate, AggregateMetadata, AggregateWithMetadata } from 'src/domain/infrastructure/ddd';
import { Diff } from 'src/domain/infrastructure/diff';
import { createDeleteDataEvent } from 'src/domain/infrastructure/events';
import { failure } from 'src/util';
import { publish } from '../bus';
import { DocumentCollection } from './persistence';

export default function delete$<TAggregate extends Aggregate<TAggregate['@type']>>(
  aggregateType: TAggregate['@type'],
  collectionFactory: () => DocumentCollection<AggregateWithMetadata<TAggregate>>,
) {
  return async (id: string, expectedVersion: number) => {
    const col = collectionFactory();

    const latestAggregate = await col.getLatestVersionById(id);

    if (!latestAggregate) {
      throw failure(`patch failed: aggregate with id ${id} of type ${aggregateType} does not exist`);
    }

    const actualVersion = latestAggregate.$metadata.version;

    if (expectedVersion !== -1 && actualVersion !== expectedVersion) {
      // tslint:disable-next-line:max-line-length
      throw failure(`patch failed: aggregate with id ${id} of type ${aggregateType} does not match the expected version (expected: ${expectedVersion}, actual: ${actualVersion})`);
    }

    if (latestAggregate.$metadata.isDeleted) {
      throw failure(`patch failed: aggregate with id ${id} of type ${aggregateType} is deleted`);
    }

    const epoch = Date.now();

    const $metadata: AggregateMetadata<TAggregate> = {
      ...latestAggregate.$metadata,
      lastUpdatedOnEpoch: epoch,
      version: actualVersion + 1,
      changesSinceLastVersion: {} as Diff<TAggregate>,
      isDeleted: true,
      eventsSinceLastVersion: [],
    };

    const updatedAggregate: AggregateWithMetadata<TAggregate> = {
      ...latestAggregate,
      $metadata,
    };

    await col.delete(updatedAggregate);

    await publish(createDeleteDataEvent(aggregateType, id, $metadata));
  };
}
