import { Subject } from 'rxjs';
import { assertNever } from '../../util/assert';
import { failure } from '../../util/result-monad';
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
  col: DocumentCollection<TAggregate & { $metadata: any }>,
)
  : <TData extends Omit<Partial<TAggregate>, keyof Aggregate>>(
    id: string,
    data: TData & Exact<Omit<Partial<TAggregate>, keyof Aggregate>, TData>,
  ) => Promise<void>;

export default function patch<TAggregateType extends string, TAggregate extends Aggregate>(
  aggregateType: TAggregateType,
  metadataType: 'Versioned',
  col: DocumentCollection<TAggregate & { $metadata: any }>,
)
  : <TData extends Omit<Partial<TAggregate>, keyof Aggregate>>(
    id: string,
    expectedVersion: number,
    data: TData & Exact<Omit<Partial<TAggregate>, keyof Aggregate>, TData>,
  ) => Promise<number>;

export default function patch<TAggregateType extends string, TAggregate extends Aggregate, TEvent extends DomainEvent<TAggregateType, TEvent['eventType']>>(
  aggregateType: TAggregateType,
  metadataType: 'EventDriven',
  col: DocumentCollection<TAggregate & { $metadata: any }>,
  eventHandlers: DomainEventHandlerMap<TAggregateType, TAggregate, TEvent>,
  allEventsSubject: Subject<DomainEvent<any, any>>,
)
  : <TData extends Omit<Partial<TAggregate>, keyof Aggregate>>(
    id: string,
    expectedVersion: number,
    data: TData & Exact<Omit<Partial<TAggregate>, keyof Aggregate>, TData>,
    ...events: TEvent[]
  ) => Promise<number>;

export default function patch<TAggregateType extends string, TAggregate extends Aggregate, TEvent extends DomainEvent<TAggregateType, TEvent['eventType']>>(
  aggregateType: TAggregateType,
  metadataType: 'Default' | 'Versioned' | 'EventDriven',
  col: DocumentCollection<TAggregate & { $metadata: any }>,
  eventHandlers?: DomainEventHandlerMap<TAggregateType, TAggregate, TEvent>,
  allEventsSubject?: Subject<TEvent>,
) {
  return async <TData extends Omit<Partial<TAggregate>, keyof Aggregate>>(
    id: string,
    expectedVersionOrData: any,
    data: TData & Exact<Omit<Partial<TAggregate>, keyof Aggregate>, TData>,
    ...events: TEvent[]
  ): Promise<number | void> => {
    const latestAggregate = await col.getLatestVersionById(id);

    if (!latestAggregate) {
      throw failure(`patch failed: aggregate with id ${id} of type ${aggregateType} does not exist`);
    }

    const expectedVersion = typeof expectedVersionOrData === 'number' ? expectedVersionOrData : -1;
    const actualVersion = (latestAggregate.$metadata as VersionedAggregateMetadata<any, any>).version;

    if (expectedVersion !== -1 && actualVersion !== expectedVersion) {
      // tslint:disable-next-line:max-line-length
      throw failure(`patch failed: aggregate with id ${id} of type ${aggregateType} does not match the expected version (expected: ${expectedVersion}, actual: ${actualVersion})`);
    }

    if ((latestAggregate.$metadata as VersionedAggregateMetadata<any, any>).isDeleted) {
      throw failure(`patch failed: aggregate with id ${id} of type ${aggregateType} is deleted`);
    }

    data = typeof expectedVersionOrData === 'number' ? data : expectedVersionOrData;

    const epoch = Date.now();

    let updatedAggregate: TAggregate = {
      ...latestAggregate,
      ...data,
    };

    if (metadataType === 'EventDriven') {
      updatedAggregate = events.reduce((e, evt) => {
        const eventHandler = eventHandlers![evt.eventType];
        return eventHandler(e, evt as DomainEventOfType<TEvent, typeof evt.eventType>);
      }, updatedAggregate);
    }

    // TODO: create diff and update metadata with diff

    const $aggregateMetadata: AggregateMetadata<TAggregateType> = {
      ...latestAggregate.$metadata,
      lastUpdatedOnEpoch: epoch,
    };

    const $versionedMetadata: VersionedAggregateMetadata<TAggregateType, TAggregate> = {
      ...latestAggregate.$metadata,
      ...$aggregateMetadata,
      version: actualVersion + 1,
      changesSinceLastVersion: {}, // TODO
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
