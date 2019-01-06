export interface RootEntity<TEntityType extends string> {
  id: string;
  $metadata: {
    entityType: TEntityType;
    createdOnEpoch: number;
    lastUpdatedOnEpoch: number;
  };
}

export interface RootEntityDefinition<TEntity extends RootEntity<TEntityType>, TEntityType extends string> {
  entityType: TEntityType;
  '@': 'RootEntityDefinition';
  '@2'?: TEntity; // prop never exists, just here for better type inference
}

export interface VersionedRootEntity<TEntity extends VersionedRootEntity<TEntity, TEntityType>, TEntityType extends string> extends RootEntity<TEntityType> {
  $metadata: RootEntity<TEntityType>['$metadata'] & {
    version: number;
    changesSinceLastVersion: Partial<Omit<TEntity, keyof VersionedRootEntity<any, any>>>;
    isDeleted: boolean;
  };
}

export interface VersionedRootEntityDefinition<TEntity extends VersionedRootEntity<TEntity, TEntityType>, TEntityType extends string> {
  entityType: TEntityType;
  '@': 'VersionedRootEntityDefinition';
  '@2'?: TEntity; // prop never exists, just here for better type inference
}

export interface DomainEvent<TEntityType extends string, TEventType extends string> {
  entityType: TEntityType;
  eventType: TEventType;
  rootEntityId: string;
  occurredOnEpoch: number;
}

export interface EventDrivenRootEntity<
  TEntity extends EventDrivenRootEntity<TEntity, TEntityType, TEvent>,
  TEntityType extends string,
  TEvent extends DomainEvent<TEntityType, TEvent['eventType']>,
  > extends VersionedRootEntity<TEntity, TEntityType> {
  $metadata: VersionedRootEntity<TEntity, TEntityType>['$metadata'] & {
    eventsSinceLastVersion: TEvent[];
  };
}

export interface EventDrivenRootEntityDefinition<
  TEntity extends EventDrivenRootEntity<TEntity, TEntityType, TEvent>,
  TEntityType extends string,
  TEvent extends DomainEvent<TEntityType, TEvent['eventType']>,
  > {
  entityType: TEntityType;
  '@': 'EventDrivenRootEntityDefinition';

  eventHandlers: DomainEventHandlerMap<TEntity, TEvent>;
}

export type DomainEventOfType<TEvent, TEventType extends string> = TEvent extends DomainEvent<any, TEventType> ? TEvent : never;

export type DomainEventHandlerMap<
  TEntity extends EventDrivenRootEntity<TEntity, TEntity['$metadata']['entityType'], TEvent>,
  TEvent extends DomainEvent<TEntity['$metadata']['entityType'], TEvent['eventType']>,
  > = {
    [eventType in TEvent['eventType']]: (entity: TEntity, event: DomainEventOfType<TEvent, eventType>) => TEntity;
  };
