import { Diff } from '../util';

export interface Aggregate {
  id: string;
}

export interface AggregateMetadata<TAggregateType extends string> {
  aggregateType: TAggregateType;
  createdOnEpoch: number;
  lastUpdatedOnEpoch: number;
}

export interface VersionedAggregateMetadata<TAggregateType extends string, TAggregate extends Aggregate> extends AggregateMetadata<TAggregateType> {
  version: number;
  changesSinceLastVersion: Diff<TAggregate>;
  isDeleted: boolean;
}

export interface DomainEvent<TAggregateType extends string, TEventType extends string> {
  aggregateType: TAggregateType;
  eventType: TEventType;
  aggregateId: string;
  occurredOnEpoch: number;
}

export interface EventDrivenAggregateMetadata<
  TAggregateType extends string,
  TAggregate extends Aggregate,
  TEvent extends DomainEvent<TAggregateType, TEvent['eventType']>,
  > extends VersionedAggregateMetadata<TAggregateType, TAggregate> {
  eventsSinceLastVersion: TEvent[];
}

export type DomainEventOfType<TEvent, TEventType extends string> = TEvent extends DomainEvent<any, TEventType> ? TEvent : never;

export type DomainEventHandlerMap<
  TAggregateType extends string,
  TAggregate extends Aggregate,
  TEvent extends DomainEvent<TAggregateType, TEvent['eventType']>,
  > = {
    [eventType in TEvent['eventType']]: (aggregate: TAggregate, event: DomainEventOfType<TEvent, eventType>) => TAggregate;
  };
