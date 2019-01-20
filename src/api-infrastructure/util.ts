import { Aggregate, AggregateMetadata, DataEvent, DataEvents, DomainEvent, Event, EventOfType } from './api-infrastructure.types';

export type EventHandlerMap<TEvent extends Event<TEvent['eventType']>> = {
  [eventType in TEvent['eventType']]: (event: EventOfType<TEvent, eventType>) => any;
};

export function createEventHandler<TEvent extends Event<TEvent['eventType']>>(handlers: EventHandlerMap<TEvent>) {
  return (evt: Event<any>) => {
    const handler = handlers[evt.eventType as TEvent['eventType']];

    if (!handler) {
      return false;
    }

    handler(evt as EventOfType<TEvent, typeof evt.eventType>);
    return true;
  };
}

export type DataEventOfType<
  TAggregate,
  TAggregateType extends string,
  TEvent,
  TEventType extends DataEvents<any, TMetadata>['eventType'],
  TMetadata extends AggregateMetadata<TAggregateType>,
  > =
  TAggregate extends Aggregate<TAggregateType>
  ? TEvent extends DataEvent<any, any, TEventType> ? EventOfType<DataEvents<TAggregate, TMetadata>, TEventType> : never
  : never;

export type DataEventHandlerMap<
  TAggregate extends Aggregate<TAggregate['@type']>,
  TEvent extends DataEvent<TAggregate, TMetadata, DataEvents<TAggregate, TMetadata>['eventType']>,
  TMetadata extends AggregateMetadata<TAggregate['@type']>,
  > = {
    [aggregateType in TAggregate['@type']]: {
      [eventType in DataEvents<TAggregate, TMetadata>['eventType']]: (event: DataEventOfType<TAggregate, aggregateType, TEvent, eventType, TMetadata>) => any;
    };
  };

export function createDataEventHandler<
  TAggregate extends Aggregate<TAggregate['@type']>,
  TMetadata extends AggregateMetadata<TAggregate['@type']>,
  TEvent extends DataEvent<TAggregate, TMetadata, DataEvents<TAggregate, TMetadata>['eventType']> = DataEvents<TAggregate, TMetadata>,
  >(
    handlers: DataEventHandlerMap<TAggregate, TEvent, TMetadata>,
) {
  return (evt: Event<any>) => {
    const aggregateType = (evt as DomainEvent<TAggregate['@type'], TEvent['eventType']>).aggregateType;
    const aggregateHandler = handlers[aggregateType];

    if (!aggregateHandler) {
      return false;
    }

    const eventHandler = aggregateHandler[evt.eventType as TEvent['eventType']] as (evt: any) => void;

    if (!eventHandler) {
      return false;
    }

    eventHandler(evt as any);
    return true;
  };
}
