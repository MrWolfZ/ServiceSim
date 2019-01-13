import { Diff } from '../util';

export interface Aggregate<TAggregateType extends string> {
  id: string;
  '@type': TAggregateType;
}

export interface AggregateMetadata<TAggregateType extends string> {
  aggregateType: TAggregateType;
  createdOnEpoch: number;
  lastUpdatedOnEpoch: number;
}

export interface VersionedAggregateMetadata<TAggregate extends Aggregate<TAggregate['@type']>>
  extends AggregateMetadata<TAggregate['@type']> {
  version: number;
  changesSinceLastVersion: Diff<TAggregate>;
  isDeleted: boolean;
}

export interface Event<TEventType extends string = string> {
  eventType: TEventType;
  occurredOnEpoch: number;
}

export interface DomainEvent<TAggregateType extends string, TEventType extends string> extends Event<TEventType> {
  aggregateType: TAggregateType;
  aggregateId: string;
}

export interface DataEvent<
  TAggregate extends Aggregate<TAggregate['@type']>,
  TEventType extends 'Create' | 'Update' | 'Delete',
  > extends DomainEvent<TAggregate['@type'], TEventType> {
  aggregate: TAggregate;
}

export interface CreateEvent<TAggregate extends Aggregate<TAggregate['@type']>> extends DataEvent<TAggregate, 'Create'> { }

export interface UpdateEvent<TAggregate extends Aggregate<TAggregate['@type']>> extends DataEvent<TAggregate, 'Update'> {
  diff: Diff<TAggregate>;
}

export interface DeleteEvent<TAggregate extends Aggregate<TAggregate['@type']>> extends DataEvent<TAggregate, 'Delete'> { }

export interface EventDrivenAggregateMetadata<
  TAggregate extends Aggregate<TAggregate['@type']>,
  TEvent extends DomainEvent<TAggregate['@type'], TEvent['eventType']>,
  > extends VersionedAggregateMetadata<TAggregate> {
  eventsSinceLastVersion: TEvent[];
}

export type DomainEventOfType<TEvent, TEventType extends string> = TEvent extends DomainEvent<any, TEventType> ? TEvent : never;

export type DomainEventHandlerMap<
  TAggregate extends Aggregate<TAggregate['@type']>,
  TEvent extends DomainEvent<TAggregate['@type'], TEvent['eventType']>,
  > = {
    [eventType in TEvent['eventType']]: (aggregate: TAggregate, event: DomainEventOfType<TEvent, eventType>) => TAggregate;
  };
