import { Diff, failure } from 'src/util';
import { Aggregate, AggregateMetadata, AggregateWithMetadata } from '../api-infrastructure.types';
import { createDeleteDataEvent, publishEvents } from '../event-log';
import { DocumentCollection } from './persistence/adapter';

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

    await publishEvents(createDeleteDataEvent(aggregateType, id, $metadata));
  };
}
