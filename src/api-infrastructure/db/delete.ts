import { assertNever } from '../../util/assert';
import { failure } from '../../util/result-monad';
import {
  EventDrivenRootEntityMetadata,
  RootEntity,
  RootEntityMetadata,
  VersionedRootEntityMetadata,
} from '../api-infrastructure.types';
import { getMetadataOfType } from './util';

export default function delete$<TEntityType extends string, TEntity extends RootEntity>(
  entityType: TEntityType,
  metadataType: 'Default',
  getEntityCollection: <TEntity>(entityType: string) => { [id: string]: (TEntity & { $metadata: any })[] },
): (id: string) => Promise<void>;

export default function delete$<TEntityType extends string, TEntity extends RootEntity>(
  entityType: TEntityType,
  metadataType: 'Versioned' | 'EventDriven',
  getEntityCollection: <TEntity>(entityType: string) => { [id: string]: (TEntity & { $metadata: any })[] },
): (id: string, expectedVersion: number) => Promise<void>;

export default function delete$<TEntityType extends string, TEntity extends RootEntity>(
  entityType: TEntityType,
  metadataType: 'Default' | 'Versioned' | 'EventDriven',
  getEntityCollection: <TEntity>(entityType: string) => { [id: string]: (TEntity & { $metadata: any })[] },
) {
  return async (id: string, expectedVersion = -1) => {
    const col = getEntityCollection<TEntity>(entityType);

    if (!col[id] || col[id].length === 0) {
      throw failure(`patch failed: entity with id ${id} of type ${entityType} does not exist`);
    }

    const latestEntity = col[id][col[id].length - 1];

    const actualVersion = (latestEntity.$metadata as VersionedRootEntityMetadata<any, any>).version;

    if (expectedVersion !== -1 && actualVersion !== expectedVersion) {
      // tslint:disable-next-line:max-line-length
      throw failure(`patch failed: entity with id ${id} of type ${entityType} does not match the expected version (expected: ${expectedVersion}, actual: ${actualVersion})`);
    }

    if ((latestEntity.$metadata as VersionedRootEntityMetadata<any, any>).isDeleted) {
      throw failure(`patch failed: entity with id ${id} of type ${entityType} is deleted`);
    }

    const epoch = Date.now();

    const $rootEntityMetadata: RootEntityMetadata<TEntityType> = {
      ...latestEntity.$metadata,
      lastUpdatedOnEpoch: epoch,
    };

    const $versionedRootEntityMetadata: VersionedRootEntityMetadata<TEntityType, TEntity> = {
      ...latestEntity.$metadata,
      ...$rootEntityMetadata,
      version: actualVersion + 1,
      changesSinceLastVersion: {},
      isDeleted: true,
    };

    const $eventDrivenRootEntityMetadata: EventDrivenRootEntityMetadata<TEntityType, TEntity, any> = {
      ...latestEntity.$metadata,
      ...$versionedRootEntityMetadata,
      eventsSinceLastVersion: [],
    };

    const $metadata = getMetadataOfType(metadataType, $rootEntityMetadata, $versionedRootEntityMetadata, $eventDrivenRootEntityMetadata);

    const updatedEntity = {
      ...latestEntity,
      $metadata,
    };

    switch (metadataType) {
      case 'Default':
        delete col[id];
        break;

      case 'Versioned':
      case 'EventDriven':
        col[id].push(updatedEntity);
        break;

      default:
        assertNever(metadataType);
        break;
    }
  };
}
