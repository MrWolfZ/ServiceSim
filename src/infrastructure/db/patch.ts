import { Aggregate, AggregateMetadata, AggregateWithMetadata, DomainEvent, DomainEventHandlerMap, EventOfType } from 'src/domain/infrastructure/ddd';
import { Diff } from 'src/domain/infrastructure/diff';
import { createUpdateDataEvent } from 'src/domain/infrastructure/events';
import { applyDiff, createDiff, failure, isEmpty } from 'src/util';
import { publish } from '../bus';
import { DocumentCollection } from './persistence';

export default function patch<TAggregate extends Aggregate<TAggregate['@type']>, TEvent extends DomainEvent<TAggregate['@type'], TEvent['eventType']>>(
  aggregateType: TAggregate['@type'],
  collectionFactory: () => DocumentCollection<AggregateWithMetadata<TAggregate>>,
  eventHandlers?: DomainEventHandlerMap<TAggregate, TEvent>,
) {
  return async (
    id: string,
    expectedVersion: number,
    diff: Diff<TAggregate>,
    ...events: (Omit<TEvent, 'aggregateId'>)[]
  ): Promise<number> => {
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

    let updatedAggregate = applyDiff(latestAggregate, diff);

    const eventsWithId: TEvent[] = events.map(evt => ({ aggregateId: id, ...evt as TEvent }));

    updatedAggregate = eventsWithId.reduce((e, evt) => {
      const eventHandler = eventHandlers![evt.eventType];
      return eventHandler(e, evt as EventOfType<TEvent, typeof evt.eventType>);
    }, updatedAggregate);

    const finalDiff = createDiff(latestAggregate, updatedAggregate);

    if (isEmpty(finalDiff) && events.length === 0) {
      return actualVersion;
    }

    const $metadata: AggregateMetadata<TAggregate, TEvent> = {
      ...latestAggregate.$metadata,
      lastUpdatedOnEpoch: epoch,
      version: actualVersion + 1,
      changesSinceLastVersion: finalDiff,
      eventsSinceLastVersion: eventsWithId,
    };

    const updatedAggregateWithMetadata: AggregateWithMetadata<TAggregate> = {
      ...updatedAggregate,
      $metadata,
    };

    await col.upsert(updatedAggregateWithMetadata);

    await publish(createUpdateDataEvent(aggregateType, id, finalDiff));
    await publish(...eventsWithId);

    return $metadata.version;
  };
}
