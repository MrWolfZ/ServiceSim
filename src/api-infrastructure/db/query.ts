import { failure } from '../../util/result-monad';
import { keys } from '../../util/util';
import { DomainEvent, EventDrivenRootEntityMetadata, RootEntity, RootEntityMetadata, VersionedRootEntityMetadata } from '../api-infrastructure.types';

export type EntityWithMetadata<TEntity, TMetadata> = TEntity & { $metadata: TMetadata };

export interface QueryOperations<TEntityType extends string, TEntity extends RootEntity, TMetadata extends RootEntityMetadata<TEntityType>> {
  byId(id: string): Promise<EntityWithMetadata<TEntity, TMetadata>>;
  all(): Promise<EntityWithMetadata<TEntity, TMetadata>[]>;
  byProperties(props: Partial<TEntity>): Promise<EntityWithMetadata<TEntity, TMetadata>[]>;
}

export interface VersionQueryOperations<
  TEntityType extends string,
  TEntity extends RootEntity,
  TMetadata extends VersionedRootEntityMetadata<TEntityType, TEntity>,
  > extends QueryOperations<TEntityType, TEntity, TMetadata> {
  byIdAndVersion(id: string, version: number): Promise<EntityWithMetadata<TEntity, TMetadata>>;
}

export default function query<TEntityType extends string, TEntity extends RootEntity>(
  entityType: TEntityType,
  metadataType: 'Default',
  getEntityCollection: <TEntity>(entityType: string) => { [id: string]: (TEntity & { $metadata: any })[] },
): QueryOperations<TEntityType, TEntity, RootEntityMetadata<TEntityType>>;

export default function query<TEntityType extends string, TEntity extends RootEntity>(
  entityType: TEntityType,
  metadataType: 'Versioned',
  getEntityCollection: <TEntity>(entityType: string) => { [id: string]: (TEntity & { $metadata: any })[] },
): VersionQueryOperations<TEntityType, TEntity, VersionedRootEntityMetadata<TEntityType, TEntity>>;

export default function query<TEntityType extends string, TEntity extends RootEntity, TEvent extends DomainEvent<TEntityType, TEvent['eventType']>>(
  entityType: TEntityType,
  metadataType: 'EventDriven',
  getEntityCollection: <TEntity>(entityType: string) => { [id: string]: (TEntity & { $metadata: any })[] },
): VersionQueryOperations<TEntityType, TEntity, EventDrivenRootEntityMetadata<TEntityType, TEntity, TEvent>>;

export default function query<TEntityType extends string, TEntity extends RootEntity, TEvent extends DomainEvent<TEntityType, TEvent['eventType']>>(
  entityType: TEntityType,
  _: 'Default' | 'Versioned' | 'EventDriven',
  getEntityCollection: <TEntity>(entityType: string) => { [id: string]: (TEntity & { $metadata: any })[] },
): VersionQueryOperations<TEntityType, TEntity, any> {
  return {
    async byId(id) {
      const col = getEntityCollection<TEntity>(entityType);

      if (!col[id] || col[id].length === 0) {
        throw failure(`byIdAsync failed: entity with id ${id} of type ${entityType} does not exist`);
      }

      const latestEntity = col[id][col[id].length - 1];

      if ((latestEntity.$metadata as VersionedRootEntityMetadata<TEntityType, TEntity>).isDeleted) {
        throw failure(`byIdAsync failed: entity with id ${id} of type ${entityType} is deleted`);
      }

      return latestEntity;
    },

    async byIdAndVersion(id, version) {
      const col = getEntityCollection<any>(entityType);

      if (!col[id] || col[id].length === 0) {
        throw failure(`byIdAndVersionAsync failed: entity with id ${id} of type ${entityType} does not exist`);
      }

      const entity = col[id].find(e => (e.$metadata as VersionedRootEntityMetadata<TEntityType, TEntity>).version === version);

      if (!entity) {
        throw failure(`byIdAndVersionAsync failed: entity with id ${id} of type ${entityType} does not have version ${version}`);
      }

      if ((entity.$metadata as VersionedRootEntityMetadata<TEntityType, TEntity>).isDeleted) {
        throw failure(`byIdAndVersionAsync failed: entity with id ${id} of type ${entityType} is deleted`);
      }

      return entity;
    },

    async all() {
      const col = getEntityCollection<any>(entityType);
      return keys(col)
        .map(k => col[k])
        .filter(entities => entities.length > 0)
        .map(entities => entities[entities.length - 1])
        .filter(e => !(e.$metadata as VersionedRootEntityMetadata<TEntityType, TEntity>).isDeleted);
    },

    async byProperties(props) {
      const col = getEntityCollection<any>(entityType);
      const propNames = keys(props);
      return keys(col)
        .map(k => col[k])
        .filter(entities => entities.length > 0)
        .map(entities => entities[entities.length - 1])
        .filter(e => !(e.$metadata as VersionedRootEntityMetadata<TEntityType, TEntity>).isDeleted)
        .filter(e => propNames.every(p => e[p] === props[p]));
    },
  };
}
