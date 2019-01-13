import { applyDiff, assertNever, createDiff, Diff, failure, isEmpty } from '../../util';
import {
  Aggregate,
  AggregateMetadata,
  DomainEvent,
  DomainEventHandlerMap,
  DomainEventOfType,
  EventDrivenAggregateMetadata,
  VersionedAggregateMetadata,
} from '../api-infrastructure.types';
import { eventBus } from '../event-bus';
import { DocumentCollection } from './adapters';
import { getMetadataOfType } from './util';

export default function patch<TAggregate extends Aggregate<TAggregate['@type']>>(
  aggregateType: TAggregate['@type'],
  metadataType: 'Default',
  collectionFactory: () => DocumentCollection<TAggregate & { $metadata: any }>,
): (id: string, diff: Diff<TAggregate>) => Promise<void>;

export default function patch<TAggregate extends Aggregate<TAggregate['@type']>>(
  aggregateType: TAggregate['@type'],
  metadataType: 'Versioned',
  collectionFactory: () => DocumentCollection<TAggregate & { $metadata: any }>,
): (id: string, expectedVersion: number, diff: Diff<TAggregate>) => Promise<number>;

export default function patch<TAggregate extends Aggregate<TAggregate['@type']>, TEvent extends DomainEvent<TAggregate['@type'], TEvent['eventType']>>(
  aggregateType: TAggregate['@type'],
  metadataType: 'EventDriven',
  collectionFactory: () => DocumentCollection<TAggregate & { $metadata: any }>,
  eventHandlers: DomainEventHandlerMap<TAggregate, TEvent>,
): (id: string, expectedVersion: number, diff: Diff<TAggregate>, ...events: TEvent[]) => Promise<number>;

export default function patch<TAggregate extends Aggregate<TAggregate['@type']>, TEvent extends DomainEvent<TAggregate['@type'], TEvent['eventType']>>(
  aggregateType: TAggregate['@type'],
  metadataType: 'Default' | 'Versioned' | 'EventDriven',
  collectionFactory: () => DocumentCollection<TAggregate & { $metadata: any }>,
  eventHandlers?: DomainEventHandlerMap<TAggregate, TEvent>,
) {
  return async (
    id: string,
    expectedVersionOrDiff: any,
    diff: Diff<TAggregate>,
    ...events: TEvent[]
  ): Promise<number | void> => {
    const col = collectionFactory();

    const latestAggregate = await col.getLatestVersionById(id);

    if (!latestAggregate) {
      throw failure(`patch failed: aggregate with id ${id} of type ${aggregateType} does not exist`);
    }

    const expectedVersion = typeof expectedVersionOrDiff === 'number' ? expectedVersionOrDiff : -1;
    const actualVersion = (latestAggregate.$metadata as VersionedAggregateMetadata<any>).version;

    if (expectedVersion !== -1 && actualVersion !== expectedVersion) {
      // tslint:disable-next-line:max-line-length
      throw failure(`patch failed: aggregate with id ${id} of type ${aggregateType} does not match the expected version (expected: ${expectedVersion}, actual: ${actualVersion})`);
    }

    if ((latestAggregate.$metadata as VersionedAggregateMetadata<any>).isDeleted) {
      throw failure(`patch failed: aggregate with id ${id} of type ${aggregateType} is deleted`);
    }

    diff = typeof expectedVersionOrDiff === 'number' ? diff : expectedVersionOrDiff;

    const epoch = Date.now();

    let updatedAggregate = applyDiff(latestAggregate, diff);

    if (metadataType === 'EventDriven') {
      updatedAggregate = events.reduce((e, evt) => {
        const eventHandler = eventHandlers![evt.eventType];
        return eventHandler(e, evt as DomainEventOfType<TEvent, typeof evt.eventType>);
      }, updatedAggregate);
    }

    const finalDiff = createDiff(latestAggregate, updatedAggregate);

    if (isEmpty(finalDiff) && events.length === 0) {
      return actualVersion;
    }

    const $aggregateMetadata: AggregateMetadata<TAggregate['@type']> = {
      ...latestAggregate.$metadata,
      lastUpdatedOnEpoch: epoch,
    };

    const $versionedMetadata: VersionedAggregateMetadata<TAggregate> = {
      ...latestAggregate.$metadata,
      ...$aggregateMetadata,
      version: actualVersion + 1,
      changesSinceLastVersion: finalDiff,
    };

    const $eventDrivenMetadata: EventDrivenAggregateMetadata<TAggregate, TEvent> = {
      ...latestAggregate.$metadata,
      ...$versionedMetadata,
      eventsSinceLastVersion: events,
    };

    const $metadata = getMetadataOfType(metadataType, $aggregateMetadata, $versionedMetadata, $eventDrivenMetadata);

    const updatedAggregateWithMetadata: TAggregate & { $metadata: any } = {
      ...updatedAggregate,
      $metadata,
    };

    switch (metadataType) {
      case 'Default':
        await col.set(id, updatedAggregateWithMetadata);
        break;

      case 'Versioned':
      case 'EventDriven':
        await col.addVersion(id, updatedAggregateWithMetadata);
        break;

      default:
        assertNever(metadataType);
        break;
    }

    events.forEach(evt => eventBus.publish(evt));

    return $versionedMetadata.version;
  };
}
