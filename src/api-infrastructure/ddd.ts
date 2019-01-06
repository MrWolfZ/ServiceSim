import { DomainEvent, DomainEventOfType, EventDrivenRootEntity, EventDrivenRootEntityDefinition } from './api-infrastructure.types';

// TODO: make custom props exact
export function createDomainEvent<
  TEntity extends EventDrivenRootEntity<TEntity, TEntityType, TEvent>,
  TEntityType extends string,
  TEvent extends DomainEvent<TEntityType, TEvent['eventType']>,
  TEventType extends string,
  >(
    entityTypeDefinition: EventDrivenRootEntityDefinition<TEntity, TEntityType, TEvent>,
    eventType: TEventType,
    customProps: Omit<DomainEventOfType<TEvent, TEventType>, Exclude<keyof DomainEvent<TEntityType, TEventType>, 'rootEntityId'>>,
): TEvent {
  const domainEventProps: Omit<DomainEvent<TEntityType, TEventType>, 'rootEntityId'> = {
    entityType: entityTypeDefinition.entityType,
    eventType,
    occurredOnEpoch: Date.now(),
  };

  return {
    ...domainEventProps,
    ...customProps as any,
  };
}
