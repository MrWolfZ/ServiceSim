import { assertNever } from '../util/assert';
import { failure, Result, success } from '../util/result-monad';
import { keys } from '../util/util';
import {
  DomainEvent,
  EventDrivenRootEntity,
  EventDrivenRootEntityDefinition,
  RootEntity,
  RootEntityDefinition,
  VersionedRootEntity,
  VersionedRootEntityDefinition,
} from './api-infrastructure.types';

const inMemoryDb: { [entityType: string]: { [id: string]: any[] } } = {};

function getEntityCollection<TEntity>(entityType: string): { [id: string]: TEntity[] } {
  return inMemoryDb[entityType] = inMemoryDb[entityType] || {};
}

async function createAsync<
  TEntity extends RootEntity<TEntityType>,
  TEntityType extends string,
  TData extends Omit<TEntity, keyof RootEntity<TEntityType>>,
  >(
    entityTypeDefinition: RootEntityDefinition<TEntity, TEntityType>,
    data: TData & Exact<Omit<TEntity, keyof RootEntity<TEntityType>>, TData>,
): Promise<TEntity>;

async function createAsync<
  TEntity extends VersionedRootEntity<TEntity, TEntityType>,
  TEntityType extends string,
  TData extends Omit<TEntity, keyof VersionedRootEntity<TEntity, TEntityType>>,
  >(
    entityTypeDefinition: VersionedRootEntityDefinition<TEntity, TEntityType>,
    data: TData & Exact<Omit<TEntity, keyof VersionedRootEntity<TEntity, TEntityType>>, TData>,
): Promise<TEntity>;

async function createAsync<
  TEntity extends EventDrivenRootEntity<TEntity, TEntityType, TEvent>,
  TEntityType extends string,
  TEvent extends DomainEvent<TEntityType, TEvent['eventType']>,
  TData extends Omit<TEntity, keyof EventDrivenRootEntity<TEntity, TEntityType, TEvent>>,
  >(
    entityTypeDefinition: EventDrivenRootEntityDefinition<TEntity, TEntityType, TEvent>,
    data: TData & Exact<Omit<TEntity, keyof EventDrivenRootEntity<TEntity, TEntityType, TEvent>>, TData>,
): Promise<TEntity>;

async function createAsync(
  entityTypeDefinition:
    RootEntityDefinition<any, any> |
    VersionedRootEntityDefinition<any, any> |
    EventDrivenRootEntityDefinition<any, any, any>,
  data: any,
): Promise<object> {
  const col = getEntityCollection<any>(entityTypeDefinition.entityType);

  const epoch = Date.now();

  const $rootEntityMetadata: RootEntity<any>['$metadata'] = {
    entityType: entityTypeDefinition.entityType,
    createdOnEpoch: epoch,
    lastUpdatedOnEpoch: epoch,
  };

  const $versionedRootEntityMetadata: VersionedRootEntity<any, any>['$metadata'] = {
    ...$rootEntityMetadata,
    version: 1,
    isDeleted: false,
    changesSinceLastVersion: {},
  };

  const $eventDrivenRootEntityMetadata: EventDrivenRootEntity<any, any, any>['$metadata'] = {
    ...$versionedRootEntityMetadata,
    eventsSinceLastVersion: [],
  };

  const $metadata = (() => {
    switch (entityTypeDefinition['@']) {
      case 'RootEntityDefinition':
        return $rootEntityMetadata;

      case 'VersionedRootEntityDefinition':
        return $versionedRootEntityMetadata;

      case 'EventDrivenRootEntityDefinition':
        return $eventDrivenRootEntityMetadata;

      default:
        return assertNever(entityTypeDefinition);
    }
  });

  const id = `${entityTypeDefinition.entityType}/${keys(col).length + 1}`;
  const newEntity = {
    id,
    $metadata,
    ...data,
  };

  col[id] = [newEntity];
  return newEntity;
}

async function patchAsync<
  TEntity extends RootEntity<TEntityType>,
  TEntityType extends string,
  TData extends Omit<Partial<TEntity>, keyof RootEntity<TEntityType>>,
  >(
    entityTypeDefinition: RootEntityDefinition<TEntity, TEntityType>,
    id: string,
    data: TData & Exact<Omit<Partial<TEntity>, keyof RootEntity<any>>, TData>,
): Promise<Result<void, string[]>>;

async function patchAsync<
  TEntity extends VersionedRootEntity<TEntity, TEntityType>,
  TEntityType extends string,
  TData extends Omit<Partial<TEntity>, keyof VersionedRootEntity<TEntity, TEntityType>>,
  >(
    entityTypeDefinition: VersionedRootEntityDefinition<TEntity, TEntityType>,
    id: string,
    expectedVersion: number,
    data: TData & Exact<Omit<Partial<TEntity>, keyof VersionedRootEntity<TEntity, TEntityType>>, TData>,
): Promise<Result<number, string[]>>;

async function patchAsync<
  TEntity extends EventDrivenRootEntity<TEntity, TEntityType, TEvent>,
  TEntityType extends string,
  TEvent extends DomainEvent<TEntityType, TEvent['eventType']>,
  TData extends Omit<Partial<TEntity>, keyof EventDrivenRootEntity<TEntity, TEntityType, TEvent>>,
  >(
    entityTypeDefinition: EventDrivenRootEntityDefinition<TEntity, TEntityType, TEvent>,
    id: string,
    expectedVersion: number,
    data: TData & Exact<Omit<Partial<TEntity>, keyof EventDrivenRootEntity<TEntity, TEntityType, TEvent>>, TData>,
    ...events: TEvent[]
  ): Promise<Result<number, string[]>>;

async function patchAsync(
  entityTypeDefinition:
    RootEntityDefinition<any, any> |
    VersionedRootEntityDefinition<any, any> |
    EventDrivenRootEntityDefinition<any, any, any>,
  id: string,
  expectedVersionOrData: number,
  data?: any,
  ...events: any[]
): Promise<Result<number | void, string[]>> {
  const col = getEntityCollection<any>(entityTypeDefinition.entityType);

  if (!col[id] || col[id].length === 0) {
    return failure([`patch failed: entity with id ${id} of type ${entityTypeDefinition.entityType} does not exist`]);
  }

  const latestEntity = col[id][col[id].length - 1];

  const expectedVersion = typeof expectedVersionOrData === 'number' ? expectedVersionOrData : -1;

  if (expectedVersion !== -1 && (latestEntity as VersionedRootEntity<any, any>).$metadata.version !== expectedVersion) {
    // tslint:disable-next-line:max-line-length
    return failure([`patch failed: entity with id ${id} of type ${entityTypeDefinition.entityType} does not match the expected version (expected: ${expectedVersion}, actual: ${latestEntity.$metadata.version})`]);
  }

  if ((latestEntity as VersionedRootEntity<any, any>).$metadata.isDeleted) {
    return failure([`patch failed: entity with id ${id} of type ${entityTypeDefinition.entityType} is deleted`]);
  }

  // TODO: perform deep merge and filter all properties that do not differ

  const epoch = Date.now();

  const $rootEntityMetadata: RootEntity<any>['$metadata'] = {
    ...(latestEntity as RootEntity<any>).$metadata,
    lastUpdatedOnEpoch: epoch,
  };

  const $versionedRootEntityMetadata: VersionedRootEntity<any, any>['$metadata'] = {
    ...(latestEntity as VersionedRootEntity<any, any>).$metadata,
    ...$rootEntityMetadata,
    version: (latestEntity as VersionedRootEntity<any, any>).$metadata.version + 1,
    changesSinceLastVersion: {},
  };

  const $eventDrivenRootEntityMetadata: EventDrivenRootEntity<any, any, any>['$metadata'] = {
    ...(latestEntity as EventDrivenRootEntity<any, any, any>).$metadata,
    ...$versionedRootEntityMetadata,
    eventsSinceLastVersion: events,
  };

  const $metadata = (() => {
    switch (entityTypeDefinition['@']) {
      case 'RootEntityDefinition':
        return $rootEntityMetadata;

      case 'VersionedRootEntityDefinition':
        return $versionedRootEntityMetadata;

      case 'EventDrivenRootEntityDefinition':
        return $eventDrivenRootEntityMetadata;

      default:
        return assertNever(entityTypeDefinition);
    }
  });

  let updatedEntity = {
    ...latestEntity,
    $metadata,
    ...data,
  };

  switch (entityTypeDefinition['@']) {
    case 'RootEntityDefinition':
      col[id] = [updatedEntity];
      break;

    case 'VersionedRootEntityDefinition':
      col[id].push(updatedEntity);
      break;

    case 'EventDrivenRootEntityDefinition':
      updatedEntity = events.reduce((e, evt: DomainEvent<any, any>) => {
        const eventHandler = entityTypeDefinition.eventHandlers[evt.eventType];
        return eventHandler(e, evt);
      }, updatedEntity);

      col[id].push(updatedEntity);
      break;

    default:
      assertNever(entityTypeDefinition);
      break;
  }

  return success(($metadata as any as VersionedRootEntity<any, any>['$metadata']).version);
}

async function deleteAsync<TEntity extends RootEntity<TEntityType>, TEntityType extends string>(
  entityTypeDefinition: RootEntityDefinition<TEntity, TEntityType>,
  id: string,
): Promise<Result<void, string[]>>;

async function deleteAsync<TEntity extends VersionedRootEntity<TEntity, TEntityType>, TEntityType extends string>(
  entityTypeDefinition: VersionedRootEntityDefinition<TEntity, TEntityType>,
  id: string,
  expectedVersion: number,
): Promise<Result<void, string[]>>;

async function deleteAsync<
  TEntity extends EventDrivenRootEntity<TEntity, TEntityType, TEvent>,
  TEntityType extends string,
  TEvent extends DomainEvent<TEntityType, TEvent['eventType']>,
  >(
    entityTypeDefinition: EventDrivenRootEntityDefinition<TEntity, TEntityType, TEvent>,
    id: string,
    expectedVersion: number,
): Promise<Result<void, string[]>>;

async function deleteAsync(
  entityTypeDefinition:
    RootEntityDefinition<any, any> |
    VersionedRootEntityDefinition<any, any> |
    EventDrivenRootEntityDefinition<any, any, any>,
  id: string,
  expectedVersion = -1,
): Promise<Result<void, string[]>> {
  const col = getEntityCollection<any>(entityTypeDefinition.entityType);

  if (!col[id] || col[id].length === 0) {
    return failure([`patch failed: entity with id ${id} of type ${entityTypeDefinition.entityType} does not exist`]);
  }

  const latestEntity = col[id][col[id].length - 1];

  if (expectedVersion !== -1 && (latestEntity as VersionedRootEntity<any, any>).$metadata.version !== expectedVersion) {
    // tslint:disable-next-line:max-line-length
    return failure([`patch failed: entity with id ${id} of type ${entityTypeDefinition.entityType} does not match the expected version (expected: ${expectedVersion}, actual: ${latestEntity.$metadata.version})`]);
  }

  if ((latestEntity as VersionedRootEntity<any, any>).$metadata.isDeleted) {
    return failure([`patch failed: entity with id ${id} of type ${entityTypeDefinition.entityType} is deleted`]);
  }

  const epoch = Date.now();

  const $rootEntityMetadata: RootEntity<any>['$metadata'] = {
    ...(latestEntity as RootEntity<any>).$metadata,
    lastUpdatedOnEpoch: epoch,
  };

  const $versionedRootEntityMetadata: VersionedRootEntity<any, any>['$metadata'] = {
    ...(latestEntity as VersionedRootEntity<any, any>).$metadata,
    ...$rootEntityMetadata,
    version: (latestEntity as VersionedRootEntity<any, any>).$metadata.version + 1,
    changesSinceLastVersion: {},
    isDeleted: true,
  };

  const $eventDrivenRootEntityMetadata: EventDrivenRootEntity<any, any, any>['$metadata'] = {
    ...(latestEntity as EventDrivenRootEntity<any, any, any>).$metadata,
    ...$versionedRootEntityMetadata,
    eventsSinceLastVersion: [],
  };

  const $metadata = (() => {
    switch (entityTypeDefinition['@']) {
      case 'RootEntityDefinition':
        return $rootEntityMetadata;

      case 'VersionedRootEntityDefinition':
        return $versionedRootEntityMetadata;

      case 'EventDrivenRootEntityDefinition':
        return $eventDrivenRootEntityMetadata;

      default:
        return assertNever(entityTypeDefinition);
    }
  });

  const updatedEntity = {
    ...latestEntity,
    $metadata,
  };

  switch (entityTypeDefinition['@']) {
    case 'RootEntityDefinition':
      delete col[id];
      break;

    case 'VersionedRootEntityDefinition':
    case 'EventDrivenRootEntityDefinition':
      col[id].push(updatedEntity);
      break;

    default:
      assertNever(entityTypeDefinition);
      break;
  }

  return success();
}

export interface QueryOperations<TEntity extends RootEntity<TEntityType>, TEntityType extends string> {
  byIdAsync(id: string): Promise<Result<TEntity, string[]>>;
  allAsync(): Promise<TEntity[]>;
  byPropertiesAsync(props: Partial<TEntity>): Promise<TEntity[]>;
}

export interface VersionQueryOperations<
  TEntity extends VersionedRootEntity<TEntity, TEntityType>,
  TEntityType extends string,
  > extends QueryOperations<TEntity, TEntityType> {
  byIdAndVersionAsync(id: string, version: number): Promise<Result<TEntity, string[]>>;
}

function query<TEntity extends RootEntity<TEntityType>, TEntityType extends string>(
  entityTypeDefinition: RootEntityDefinition<TEntity, TEntityType>,
): QueryOperations<TEntity, TEntityType>;

function query<TEntity extends VersionedRootEntity<TEntity, TEntityType>, TEntityType extends string>(
  entityTypeDefinition: VersionedRootEntityDefinition<TEntity, TEntityType>,
): VersionQueryOperations<TEntity, TEntityType>;

function query<
  TEntity extends EventDrivenRootEntity<TEntity, TEntityType, TEvent>,
  TEntityType extends string,
  TEvent extends DomainEvent<TEntityType, TEvent['eventType']>,
  >(
    entityTypeDefinition: EventDrivenRootEntityDefinition<TEntity, TEntityType, TEvent>,
): VersionQueryOperations<TEntity, TEntityType>;

function query(
  entityTypeDefinition:
    RootEntityDefinition<any, any> |
    VersionedRootEntityDefinition<any, any> |
    EventDrivenRootEntityDefinition<any, any, any>,
): VersionQueryOperations<any, any> {
  return {
    async byIdAsync(id) {
      const col = getEntityCollection<any>(entityTypeDefinition.entityType);

      if (!col[id] || col[id].length === 0) {
        return failure([`byIdAsync failed: entity with id ${id} of type ${entityTypeDefinition.entityType} does not exist`]);
      }

      const latestEntity = col[id][col[id].length - 1];

      if ((latestEntity as VersionedRootEntity<any, any>).$metadata.isDeleted) {
        return failure([`byIdAsync failed: entity with id ${id} of type ${entityTypeDefinition.entityType} is deleted`]);
      }

      return success(latestEntity);
    },

    async byIdAndVersionAsync(id, version) {
      const col = getEntityCollection<any>(entityTypeDefinition.entityType);

      if (!col[id] || col[id].length === 0) {
        return failure([`byIdAndVersionAsync failed: entity with id ${id} of type ${entityTypeDefinition.entityType} does not exist`]);
      }

      const entity = col[id].find(e => (e as VersionedRootEntity<any, any>).$metadata.version === version);

      if (!entity) {
        return failure([`byIdAndVersionAsync failed: entity with id ${id} of type ${entityTypeDefinition.entityType} does not have version ${version}`]);
      }

      if ((entity as VersionedRootEntity<any, any>).$metadata.isDeleted) {
        return failure([`byIdAndVersionAsync failed: entity with id ${id} of type ${entityTypeDefinition.entityType} is deleted`]);
      }

      return success(entity);
    },

    async allAsync() {
      const col = getEntityCollection<any>(entityTypeDefinition.entityType);
      return keys(col)
        .map(k => col[k])
        .filter(entities => entities.length > 0)
        .map(entities => entities[entities.length - 1])
        .filter(e => !(e as VersionedRootEntity<any, any>).$metadata.isDeleted);
    },

    async byPropertiesAsync(props) {
      const col = getEntityCollection<any>(entityTypeDefinition.entityType);
      const propNames = keys(props) as string[];
      return keys(col)
        .map(k => col[k])
        .filter(entities => entities.length > 0)
        .map(entities => entities[entities.length - 1])
        .filter(e => !(e as VersionedRootEntity<any, any>).$metadata.isDeleted)
        .filter(e => propNames.every(p => e[p] === props[p]));
    },
  };
}

export const DB = {
  async initializeAsync() {
    // nothing to do

    // TODO: initialize connection to data storage
  },

  createAsync,
  patchAsync,
  deleteAsync,

  async dropAllAsync<TEntityType extends string>(entityType: TEntityType): Promise<void> {
    inMemoryDb[entityType] = {};
  },

  query,
};

// await DB.withSession(async s => {
//   await s.advanced.documentStore.operations.send(new DeleteByQueryOperation(new IndexQuery('from \'predicate-templates\'')));
//   await s.saveChanges();
// });
