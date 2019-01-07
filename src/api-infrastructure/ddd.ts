import { DomainEvent, DomainEventOfType } from './api-infrastructure.types';

// TODO: make custom props exact
export function createDomainEvent<
  TEntityType extends string,
  TEvent extends DomainEvent<TEntityType, TEvent['eventType']>,
  TEventType extends string,
  >(
    entityType: TEntityType,
    eventType: TEventType,
    customProps: Omit<DomainEventOfType<TEvent, TEventType>, Exclude<keyof DomainEvent<TEntityType, TEventType>, 'rootEntityId'>>,
): TEvent {
  const domainEventProps: Omit<DomainEvent<TEntityType, TEventType>, 'rootEntityId'> = {
    entityType,
    eventType,
    occurredOnEpoch: Date.now(),
  };

  return {
    ...domainEventProps,
    ...customProps as any,
  };
}
