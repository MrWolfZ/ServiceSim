import { Diff } from './diff';

export interface Aggregate<TAggregateType extends string> {
  id: string;
  '@type': TAggregateType;
}

export interface AggregateMetadata<
  TAggregate extends Aggregate<TAggregate['@type']>,
  TEvent extends DomainEvent<TAggregate['@type'], TEvent['eventType']> = any,
  > {
  aggregateType: TAggregate['@type'];
  createdOnEpoch: number;
  lastUpdatedOnEpoch: number;
  version: number;
  changesSinceLastVersion: Diff<TAggregate>;
  eventsSinceLastVersion: TEvent[];
  isDeleted: boolean;
}

export type AggregateWithMetadata<TAggregate extends Aggregate<TAggregate['@type']>> = TAggregate & { $metadata: AggregateMetadata<TAggregate> };

export interface Event<TEventType extends string> {
  eventType: TEventType;
  occurredOnEpoch: number;
}

export interface DomainEvent<TAggregateType extends string, TEventType extends string> extends Event<TEventType> {
  aggregateType: TAggregateType;
  aggregateId: string;
}

export interface DataEvent<
  TAggregate extends Aggregate<TAggregate['@type']>,
  TEventType extends 'Create' | 'Update' | 'FullUpdate' | 'Delete',
  > extends DomainEvent<TAggregate['@type'], TEventType> {
}

export interface CreateEvent<TAggregate extends Aggregate<TAggregate['@type']>>
  extends DataEvent<TAggregate, 'Create'> {
  aggregate: TAggregate;
}

export interface UpdateEvent<TAggregate extends Aggregate<TAggregate['@type']>>
  extends DataEvent<TAggregate, 'Update'> {
  diff: Diff<TAggregate>;
}

export interface FullUpdateEvent<TAggregate extends Aggregate<TAggregate['@type']>>
  extends DataEvent<TAggregate, 'FullUpdate'> {
  aggregate: TAggregate;
}

export interface DeleteEvent<TAggregate extends Aggregate<TAggregate['@type']>>
  extends DataEvent<TAggregate, 'Delete'> {
}

export type DataEvents<TAggregate extends Aggregate<TAggregate['@type']>> =
  | CreateEvent<TAggregate>
  | UpdateEvent<TAggregate>
  | FullUpdateEvent<TAggregate>
  | DeleteEvent<TAggregate>
  ;

export type EventOfType<TEvent, TEventType extends string> = TEvent extends Event<TEventType> ? TEvent : never;

export type DomainEventHandlerMap<
  TAggregate extends Aggregate<TAggregate['@type']>,
  TEvent extends DomainEvent<TAggregate['@type'], TEvent['eventType']>,
  > = {
    [eventType in TEvent['eventType']]: (aggregate: TAggregate, event: EventOfType<TEvent, eventType>) => TAggregate;
  };
