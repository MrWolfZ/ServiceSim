import { Subject } from 'rxjs';
import { assertNever } from '../../util/assert';
import { failure } from '../../util/result-monad';
import {
  DomainEvent,
  DomainEventHandlerMap,
  DomainEventOfType,
  EventDrivenRootEntityMetadata,
  RootEntity,
  RootEntityMetadata,
  VersionedRootEntityMetadata,
} from '../api-infrastructure.types';
import { getMetadataOfType } from './util';

export default function patch<TEntityType extends string, TEntity extends RootEntity>(
  entityType: TEntityType,
  metadataType: 'Default',
  getEntityCollection: <TEntity>(entityType: string) => { [id: string]: (TEntity & { $metadata: any })[] },
)
  : <TData extends Omit<Partial<TEntity>, keyof RootEntity>>(
    id: string,
    data: TData & Exact<Omit<Partial<TEntity>, keyof RootEntity>, TData>,
  ) => Promise<void>;

export default function patch<TEntityType extends string, TEntity extends RootEntity>(
  entityType: TEntityType,
  metadataType: 'Versioned',
  getEntityCollection: <TEntity>(entityType: string) => { [id: string]: (TEntity & { $metadata: any })[] },
)
  : <TData extends Omit<Partial<TEntity>, keyof RootEntity>>(
    id: string,
    expectedVersion: number,
    data: TData & Exact<Omit<Partial<TEntity>, keyof RootEntity>, TData>,
  ) => Promise<number>;

export default function patch<TEntityType extends string, TEntity extends RootEntity, TEvent extends DomainEvent<TEntityType, TEvent['eventType']>>(
  entityType: TEntityType,
  metadataType: 'EventDriven',
  getEntityCollection: <TEntity>(entityType: string) => { [id: string]: (TEntity & { $metadata: any })[] },
  eventHandlers: DomainEventHandlerMap<TEntityType, TEntity, TEvent>,
  allEventsSubject: Subject<DomainEvent<any, any>>,
)
  : <TData extends Omit<Partial<TEntity>, keyof RootEntity>>(
    id: string,
    expectedVersion: number,
    data: TData & Exact<Omit<Partial<TEntity>, keyof RootEntity>, TData>,
    ...events: TEvent[]
  ) => Promise<number>;

export default function patch<TEntityType extends string, TEntity extends RootEntity, TEvent extends DomainEvent<TEntityType, TEvent['eventType']>>(
  entityType: TEntityType,
  metadataType: 'Default' | 'Versioned' | 'EventDriven',
  getEntityCollection: <TEntity>(entityType: string) => { [id: string]: (TEntity & { $metadata: any })[] },
  eventHandlers?: DomainEventHandlerMap<TEntityType, TEntity, TEvent>,
  allEventsSubject?: Subject<TEvent>,
) {
  return async <TData extends Omit<Partial<TEntity>, keyof RootEntity>>(
    id: string,
    expectedVersionOrData: any,
    data: TData & Exact<Omit<Partial<TEntity>, keyof RootEntity>, TData>,
    ...events: TEvent[]
  ): Promise<number | void> => {
    const col = getEntityCollection<TEntity>(entityType);

    if (!col[id] || col[id].length === 0) {
      throw failure(`patch failed: entity with id ${id} of type ${entityType} does not exist`);
    }

    const latestEntity = col[id][col[id].length - 1];

    const expectedVersion = typeof expectedVersionOrData === 'number' ? expectedVersionOrData : -1;
    const actualVersion = (latestEntity.$metadata as VersionedRootEntityMetadata<any, any>).version;

    if (expectedVersion !== -1 && actualVersion !== expectedVersion) {
      // tslint:disable-next-line:max-line-length
      throw failure(`patch failed: entity with id ${id} of type ${entityType} does not match the expected version (expected: ${expectedVersion}, actual: ${actualVersion})`);
    }

    if ((latestEntity.$metadata as VersionedRootEntityMetadata<any, any>).isDeleted) {
      throw failure(`patch failed: entity with id ${id} of type ${entityType} is deleted`);
    }

    data = typeof expectedVersionOrData === 'number' ? data : expectedVersionOrData;

    const epoch = Date.now();

    let updatedEntity: TEntity = {
      ...latestEntity,
      ...data,
    };

    if (metadataType === 'EventDriven') {
      updatedEntity = events.reduce((e, evt) => {
        const eventHandler = eventHandlers![evt.eventType];
        return eventHandler(e, evt as DomainEventOfType<TEvent, typeof evt.eventType>);
      }, updatedEntity);
    }

    // TODO: create diff and update metadata with diff

    const $rootEntityMetadata: RootEntityMetadata<TEntityType> = {
      ...latestEntity.$metadata,
      lastUpdatedOnEpoch: epoch,
    };

    const $versionedRootEntityMetadata: VersionedRootEntityMetadata<TEntityType, TEntity> = {
      ...latestEntity.$metadata,
      ...$rootEntityMetadata,
      version: actualVersion + 1,
      changesSinceLastVersion: {}, // TODO
    };

    const $eventDrivenRootEntityMetadata: EventDrivenRootEntityMetadata<TEntityType, TEntity, TEvent> = {
      ...latestEntity.$metadata,
      ...$versionedRootEntityMetadata,
      eventsSinceLastVersion: events,
    };

    const $metadata = getMetadataOfType(metadataType, $rootEntityMetadata, $versionedRootEntityMetadata, $eventDrivenRootEntityMetadata);

    const updatedEntityWithMetadata: TEntity & { $metadata: any } = {
      ...updatedEntity,
      $metadata,
    };

    switch (metadataType) {
      case 'Default':
        col[id] = [updatedEntityWithMetadata];
        break;

      case 'Versioned':
      case 'EventDriven':
        col[id].push(updatedEntityWithMetadata);
        break;

      default:
        assertNever(metadataType);
        break;
    }

    events.forEach(evt => allEventsSubject!.next(evt));

    return $versionedRootEntityMetadata.version;
  };
}
