import { keys } from '../../util/util';
import { EventDrivenRootEntityMetadata, RootEntity, RootEntityMetadata, VersionedRootEntityMetadata } from '../api-infrastructure.types';
import { getMetadataOfType } from './util';

export default function create<TEntityType extends string, TEntity extends RootEntity>(
  entityType: TEntityType,
  metadataType: 'Default' | 'Versioned' | 'EventDriven',
  getEntityCollection: <TEntity>(entityType: string) => { [id: string]: (TEntity & { $metadata: any })[] },
) {
  return async <TData extends Omit<TEntity, keyof RootEntity>>(
    data: TData & Exact<Omit<TEntity, keyof RootEntity>, TData>,
  ): Promise<TEntity> => {
    const col = getEntityCollection<TEntity>(entityType);

    const epoch = Date.now();

    const $rootEntityMetadata: RootEntityMetadata<TEntityType> = {
      entityType,
      createdOnEpoch: epoch,
      lastUpdatedOnEpoch: epoch,
    };

    const $versionedRootEntityMetadata: VersionedRootEntityMetadata<TEntityType, TEntity> = {
      ...$rootEntityMetadata,
      version: 1,
      isDeleted: false,
      changesSinceLastVersion: {},
    };

    const $eventDrivenRootEntityMetadata: EventDrivenRootEntityMetadata<TEntityType, TEntity, any> = {
      ...$versionedRootEntityMetadata,
      eventsSinceLastVersion: [],
    };

    const id = `${entityType}/${keys(col).length + 1}`;
    const $metadata = getMetadataOfType(metadataType, $rootEntityMetadata, $versionedRootEntityMetadata, $eventDrivenRootEntityMetadata);

    const newEntity: TEntity & { $metadata: any } = {
      id,
      $metadata,
      ...data as any,
    };

    col[id] = [newEntity];
    return newEntity;
  };
}
