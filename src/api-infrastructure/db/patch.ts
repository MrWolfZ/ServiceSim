import { Subject } from 'rxjs';
import { applyDiff, assertNever, createDiff, Diff, failure } from '../../util';
import {
  Aggregate,
  AggregateMetadata,
  DomainEvent,
  DomainEventHandlerMap,
  DomainEventOfType,
  EventDrivenAggregateMetadata,
  VersionedAggregateMetadata,
} from '../api-infrastructure.types';
import { DocumentCollection } from './adapters';
import { getMetadataOfType } from './util';

export default function patch<TAggregateType extends string, TAggregate extends Aggregate>(
  aggregateType: TAggregateType,
  metadataType: 'Default',
  collectionFactory: () => DocumentCollection<TAggregate & { $metadata: any }>,
): (id: string, diff: Diff<TAggregate>) => Promise<void>;

export default function patch<TAggregateType extends string, TAggregate extends Aggregate>(
  aggregateType: TAggregateType,
  metadataType: 'Versioned',
  collectionFactory: () => DocumentCollection<TAggregate & { $metadata: any }>,
): (id: string, expectedVersion: number, diff: Diff<TAggregate>) => Promise<number>;

export default function patch<TAggregateType extends string, TAggregate extends Aggregate, TEvent extends DomainEvent<TAggregateType, TEvent['eventType']>>(
  aggregateType: TAggregateType,
  metadataType: 'EventDriven',
  collectionFactory: () => DocumentCollection<TAggregate & { $metadata: any }>,
  eventHandlers: DomainEventHandlerMap<TAggregateType, TAggregate, TEvent>,
  allEventsSubject: Subject<DomainEvent<any, any>>,
): (id: string, expectedVersion: number, diff: Diff<TAggregate>, ...events: TEvent[]) => Promise<number>;

export default function patch<TAggregateType extends string, TAggregate extends Aggregate, TEvent extends DomainEvent<TAggregateType, TEvent['eventType']>>(
  aggregateType: TAggregateType,
  metadataType: 'Default' | 'Versioned' | 'EventDriven',
  collectionFactory: () => DocumentCollection<TAggregate & { $metadata: any }>,
  eventHandlers?: DomainEventHandlerMap<TAggregateType, TAggregate, TEvent>,
  allEventsSubject?: Subject<TEvent>,
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
    const actualVersion = (latestAggregate.$metadata as VersionedAggregateMetadata<any, any>).version;

    if (expectedVersion !== -1 && actualVersion !== expectedVersion) {
      // tslint:disable-next-line:max-line-length
      throw failure(`patch failed: aggregate with id ${id} of type ${aggregateType} does not match the expected version (expected: ${expectedVersion}, actual: ${actualVersion})`);
    }

    if ((latestAggregate.$metadata as VersionedAggregateMetadata<any, any>).isDeleted) {
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

    const $aggregateMetadata: AggregateMetadata<TAggregateType> = {
      ...latestAggregate.$metadata,
      lastUpdatedOnEpoch: epoch,
    };

    const $versionedMetadata: VersionedAggregateMetadata<TAggregateType, TAggregate> = {
      ...latestAggregate.$metadata,
      ...$aggregateMetadata,
      version: actualVersion + 1,
      changesSinceLastVersion: finalDiff,
    };

    const $eventDrivenMetadata: EventDrivenAggregateMetadata<TAggregateType, TAggregate, TEvent> = {
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

    events.forEach(evt => allEventsSubject!.next(evt));

    return $versionedMetadata.version;
  };
}
