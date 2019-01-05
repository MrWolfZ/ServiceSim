export interface DomainEventData<TKind extends string = string> {
  kind: TKind;
  occurredOnEpoch: number;
  eventVersion: number;
}

export interface EventSourcedRootEntityData<TEvent extends DomainEventData<TEvent['kind']>> {
  id: string;
  mutatingEvents: TEvent[];
  mutatedVersion: number;
  unmutatedVersion: number;
}

export type EntityEventHandler<TEvent extends DomainEventData<TEvent['kind']> = DomainEventData<TEvent['kind']>> = (event: TEvent) => void;

export type EventOfKind<TEvent, TKind extends string> = TEvent extends DomainEventData<TKind> ? TEvent : never;

export type EventHandlerMap<TEvent extends DomainEventData> = {
  [eventKind in TEvent['kind']]: EntityEventHandler<EventOfKind<TEvent, eventKind>>;
};

export interface RootEntity<TEntityType extends string> {
  id: string;
  $metadata: {
    entityType: TEntityType;
    createdOnEpoch: number;
    lastUpdatedOnEpoch: number;
  };
}

// @ts-ignore (type params only used for type inference)
export interface RootEntityDefinition<TEntity extends RootEntity<TEntityType>, TEntityType extends string> {
  entityType: TEntityType;
  '@': 'RootEntityDefinition';
}

export interface VersionedRootEntity<TEntityType extends string> extends RootEntity<TEntityType> {
  $metadata: RootEntity<TEntityType>['$metadata'] & {
    version: number;
    isDeleted: boolean;
  };
}

// @ts-ignore (type params only used for type inference)
export interface VersionedRootEntityDefinition<TEntity extends VersionedRootEntity<TEntityType>, TEntityType extends string> {
  entityType: TEntityType;
  '@': 'VersionedRootEntityDefinition';
}

export interface IdAndVersion {
  id: string;
  version: number;
}
