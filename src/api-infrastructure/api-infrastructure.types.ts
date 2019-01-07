export interface RootEntity {
  id: string;
}

export interface RootEntityMetadata<TEntityType extends string> {
  entityType: TEntityType;
  createdOnEpoch: number;
  lastUpdatedOnEpoch: number;
}

export interface VersionedRootEntityMetadata<TEntityType extends string, TEntity extends RootEntity> extends RootEntityMetadata<TEntityType> {
  version: number;
  changesSinceLastVersion: Partial<Omit<TEntity, keyof RootEntity>>;
  isDeleted: boolean;
}

export interface DomainEvent<TEntityType extends string, TEventType extends string> {
  entityType: TEntityType;
  eventType: TEventType;
  rootEntityId: string;
  occurredOnEpoch: number;
}

export interface EventDrivenRootEntityMetadata<
  TEntityType extends string,
  TEntity extends RootEntity,
  TEvent extends DomainEvent<TEntityType, TEvent['eventType']>,
  > extends VersionedRootEntityMetadata<TEntityType, TEntity> {
  eventsSinceLastVersion: TEvent[];
}

export type DomainEventOfType<TEvent, TEventType extends string> = TEvent extends DomainEvent<any, TEventType> ? TEvent : never;

export type DomainEventHandlerMap<
  TEntityType extends string,
  TEntity extends RootEntity,
  TEvent extends DomainEvent<TEntityType, TEvent['eventType']>,
  > = {
    [eventType in TEvent['eventType']]: (entity: TEntity, event: DomainEventOfType<TEvent, eventType>) => TEntity;
  };
