import { DomainEvent, DomainEventOfType } from './api-infrastructure.types';

// TODO: make custom props exact
export function createDomainEvent<
  TAggregateType extends string,
  TEvent extends DomainEvent<TAggregateType, TEvent['eventType']>,
  TEventType extends string,
  >(
    aggregateType: TAggregateType,
    eventType: TEventType,
    customProps: Omit<DomainEventOfType<TEvent, TEventType>, Exclude<keyof DomainEvent<TAggregateType, TEventType>, 'aggregateId'>>,
): TEvent {
  const domainEventProps: Omit<DomainEvent<TAggregateType, TEventType>, 'aggregateId'> = {
    aggregateType,
    eventType,
    occurredOnEpoch: Date.now(),
  };

  return {
    ...domainEventProps,
    ...customProps as any,
  };
}
