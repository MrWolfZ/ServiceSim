import { failure, Result, success } from '../util/result-monad';
import { keys } from '../util/util';
import { RootEntity, RootEntityDefinition, VersionedRootEntity, VersionedRootEntityDefinition } from './api-infrastructure.types';

const inMemoryDb = {
  unversioned: {} as { [entityType: string]: { [id: string]: any } },
  versioned: {} as { [entityType: string]: { [id: string]: any[] } },
};

function getEntityCollection<TEntity>(entityType: string): { [id: string]: TEntity } {
  return inMemoryDb.unversioned[entityType] = inMemoryDb.unversioned[entityType] || {};
}

function getVersionedEntityCollection<TEntity>(entityType: string): { [id: string]: TEntity[] } {
  return inMemoryDb.versioned[entityType] = inMemoryDb.versioned[entityType] || {};
}

export const DB = {
  async initializeAsync() {
    // nothing to do
  },

  async createAsync<
    TEntity extends RootEntity<TEntityType>,
    TEntityType extends string,
    TData extends Omit<TEntity, keyof RootEntity<TEntityType>>,
    >(
      entityTypeDefinition: RootEntityDefinition<TEntity, TEntityType>,
      data: TData & Exact<Omit<TEntity, keyof RootEntity<TEntityType>>, TData>,
  ): Promise<TEntity> {
    const col = getEntityCollection<TEntity>(entityTypeDefinition.entityType);

    const epoch = Date.now();
    const $metadata: RootEntity<TEntityType>['$metadata'] = {
      entityType: entityTypeDefinition.entityType,
      createdOnEpoch: epoch,
      lastUpdatedOnEpoch: epoch,
    };

    const id = `${entityTypeDefinition.entityType}/${keys(col).length + 1}`;
    const newEntity: TEntity = {
      id,
      $metadata,
      ...(data as any),
    };

    return col[id] = newEntity;
  },

  async createVersionAsync<
    TEntity extends VersionedRootEntity<TEntityType>,
    TEntityType extends string,
    TData extends Omit<TEntity, keyof VersionedRootEntity<TEntityType>>,
    >(
      entityTypeDefinition: VersionedRootEntityDefinition<TEntity, TEntityType>,
      data: TData & Exact<Omit<TEntity, keyof VersionedRootEntity<TEntityType>>, TData>,
  ): Promise<TEntity> {
    const col = getVersionedEntityCollection<TEntity>(entityTypeDefinition.entityType);

    const epoch = Date.now();
    const $metadata: VersionedRootEntity<TEntityType>['$metadata'] = {
      entityType: entityTypeDefinition.entityType,
      createdOnEpoch: epoch,
      lastUpdatedOnEpoch: epoch,
      version: 1,
      isDeleted: false,
    };

    const id = `${entityTypeDefinition.entityType}/${keys(col).length + 1}`;
    const newEntity: TEntity = {
      id,
      $metadata,
      ...(data as any),
    };

    col[id] = [newEntity];
    return newEntity;
  },

  async patchAsync<
    TEntity extends RootEntity<TEntityType>,
    TEntityType extends string,
    TData extends Omit<Partial<TEntity>, keyof RootEntity<TEntityType>>,
    >(
      entityTypeDefinition: RootEntityDefinition<TEntity, TEntityType>,
      id: string,
      data: TData & Exact<Omit<Partial<TEntity>, keyof RootEntity<any>>, TData>,
  ): Promise<Result<TEntity, string[]>> {
    const col = getEntityCollection<TEntity>(entityTypeDefinition.entityType);

    if (!col[id]) {
      return failure([`patch failed: entity with id ${id} of type ${entityTypeDefinition.entityType} does not exist`]);
    }

    const entity = col[id];

    const epoch = Date.now();
    const $metadata: RootEntity<TEntityType>['$metadata'] = {
      ...entity.$metadata,
      lastUpdatedOnEpoch: epoch,
    };

    const updatedEntity: TEntity = {
      ...entity,
      $metadata,
      ...data,
    };

    return success(col[id] = updatedEntity);
  },

  async patchVersionAsync<
    TEntity extends VersionedRootEntity<TEntityType>,
    TEntityType extends string,
    TData extends Omit<Partial<TEntity>, keyof VersionedRootEntity<TEntityType>>,
    >(
      entityTypeDefinition: VersionedRootEntityDefinition<TEntity, TEntityType>,
      id: string,
      expectedVersion: number,
      data: TData & Exact<Omit<Partial<TEntity>, keyof VersionedRootEntity<any>>, TData>,
  ): Promise<Result<TEntity, string[]>> {
    const col = getVersionedEntityCollection<TEntity>(entityTypeDefinition.entityType);

    if (!col[id]) {
      return failure([`patch failed: entity with id ${id} of type ${entityTypeDefinition.entityType} does not exist`]);
    }

    const latestEntity = col[id][col[id].length - 1];

    if (latestEntity.$metadata.version !== expectedVersion) {
      // tslint:disable-next-line:max-line-length
      return failure([`patch failed: entity with id ${id} of type ${entityTypeDefinition.entityType} does not match the expected version (expected: ${expectedVersion}, actual: ${latestEntity.$metadata.version})`]);
    }

    if (latestEntity.$metadata.isDeleted) {
      return failure([`patch failed: entity with id ${id} of type ${entityTypeDefinition.entityType} is deleted`]);
    }

    const epoch = Date.now();
    const $metadata: VersionedRootEntity<TEntityType>['$metadata'] = {
      ...latestEntity.$metadata,
      version: latestEntity.$metadata.version + 1,
      lastUpdatedOnEpoch: epoch,
    };

    const updatedEntity: TEntity = {
      ...latestEntity,
      $metadata,
      ...data,
    };

    col[id].push(updatedEntity);
    return success(updatedEntity);
  },

  async deleteAsync<TEntity extends RootEntity<TEntityType>, TEntityType extends string>(
    entityTypeDefinition: RootEntityDefinition<TEntity, TEntityType>,
    id: string,
  ): Promise<Result<void, string[]>> {
    const col = getEntityCollection<TEntity>(entityTypeDefinition.entityType);

    if (!col[id]) {
      return failure([`delete failed: entity with id ${id} of type ${entityTypeDefinition.entityType} does not exist`]);
    }

    delete col[id];
    return success();
  },

  async deleteVersionAsync<TEntity extends VersionedRootEntity<TEntityType>, TEntityType extends string>(
    entityTypeDefinition: VersionedRootEntityDefinition<TEntity, TEntityType>,
    id: string,
    expectedVersion: number,
  ): Promise<Result<void, string[]>> {
    const col = getVersionedEntityCollection<TEntity>(entityTypeDefinition.entityType);

    if (!col[id]) {
      return failure([`delete failed: entity with id ${id} of type ${entityTypeDefinition.entityType} does not exist`]);
    }

    const latestEntity = col[id][col[id].length - 1];

    if (latestEntity.$metadata.version !== expectedVersion) {
      // tslint:disable-next-line:max-line-length
      return failure([`delete failed: entity with id ${id} of type ${entityTypeDefinition.entityType} does not match the expected version (expected: ${expectedVersion}, actual: ${latestEntity.$metadata.version})`]);
    }

    if (latestEntity.$metadata.isDeleted) {
      return failure([`patch failed: entity with id ${id} of type ${entityTypeDefinition.entityType} is already deleted`]);
    }

    const epoch = Date.now();
    const $metadata: VersionedRootEntity<TEntityType>['$metadata'] = {
      ...latestEntity.$metadata,
      version: latestEntity.$metadata.version + 1,
      lastUpdatedOnEpoch: epoch,
      isDeleted: true,
    };

    const updatedEntity: TEntity = {
      ...latestEntity,
      $metadata,
    };

    col[id].push(updatedEntity);
    return success();
  },

  async dropAllAsync<TEntityType extends string>(
    entityType: TEntityType,
  ): Promise<void> {
    inMemoryDb.unversioned[entityType] = {};
    inMemoryDb.versioned[entityType] = {};
  },

  query<TEntity extends RootEntity<TEntityType>, TEntityType extends string>(
    entityTypeDefinition: RootEntityDefinition<TEntity, TEntityType>,
  ) {
    return {
      async ofIdAsync(id: string): Promise<Result<TEntity, string[]>> {
        const col = getEntityCollection<TEntity>(entityTypeDefinition.entityType);

        if (!col[id]) {
          return failure([`ofIdAsync failed: entity with id ${id} of type ${entityTypeDefinition.entityType} does not exist`]);
        }

        return success(col[id]);
      },

      async allAsync(): Promise<TEntity[]> {
        const col = getEntityCollection<TEntity>(entityTypeDefinition.entityType);
        return keys(col).map(k => col[k]);
      },
    };
  },

  queryVersion<TEntity extends VersionedRootEntity<TEntityType>, TEntityType extends string>(
    entityTypeDefinition: VersionedRootEntityDefinition<TEntity, TEntityType>,
  ) {
    return {
      async latestOfIdAsync(id: string): Promise<Result<TEntity, string[]>> {
        const col = getVersionedEntityCollection<TEntity>(entityTypeDefinition.entityType);

        if (!col[id]) {
          return failure([`ofIdAsync failed: entity with id ${id} of type ${entityTypeDefinition.entityType} does not exist`]);
        }

        const latestEntity = col[id][col[id].length - 1];

        if (latestEntity.$metadata.isDeleted) {
          return failure([`patch failed: entity with id ${id} of type ${entityTypeDefinition.entityType} is already deleted`]);
        }

        return success(latestEntity);
      },

      async allLatestAsync(): Promise<TEntity[]> {
        const col = getVersionedEntityCollection<TEntity>(entityTypeDefinition.entityType);
        return keys(col).map(k => col[k][col[k].length - 1]).filter(e => !e.$metadata.isDeleted);
      },
    };
  },
};

// await DB.withSession(async s => {
//   await s.advanced.documentStore.operations.send(new DeleteByQueryOperation(new IndexQuery('from \'predicate-templates\'')));
//   await s.saveChanges();
// });
