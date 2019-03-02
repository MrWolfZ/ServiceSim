import { generateId } from 'src/util/id';
import { Aggregate, CreateEvent, DeleteEvent, DomainEvent, Event, EventOfType, UpdateEvent } from './ddd';
import { Diff } from './diff';

export function createEvent<TEventType extends string>(eventType: TEventType): Event<TEventType> {
  return {
    eventId: generateId(21),
    eventType,
    occurredOnEpoch: Date.now(),
  };
}

export function createDomainEvent<
  TEvent extends DomainEvent<TEvent['aggregateType'], TEvent['eventType']>,
  TCustomProps extends Omit<EventOfType<TEvent, TEvent['eventType']>, keyof DomainEvent<TEvent['aggregateType'], TEvent['eventType']>>
  = Omit<EventOfType<TEvent, TEvent['eventType']>, keyof DomainEvent<TEvent['aggregateType'], TEvent['eventType']>>,
  >(
    eventType: TEvent['eventType'],
    aggregateType: TEvent['aggregateType'],
    aggregateId: string,
    // tslint:disable-next-line:max-line-length
    customProps: TCustomProps & Exact<Omit<EventOfType<TEvent, TEvent['eventType']>, keyof DomainEvent<TEvent['aggregateType'], TEvent['eventType']>>, TCustomProps>,
): TEvent {
  const domainEventProps: DomainEvent<TEvent['aggregateType'], TEvent['eventType']> = {
    ...createEvent(eventType),
    aggregateType,
    aggregateId,
  };

  return {
    ...domainEventProps,
    ...customProps as any,
  };
}

export function createCreateDataEvent<TAggregate extends Aggregate<TAggregate['@type']>>(
  aggregate: TAggregate,
): CreateEvent<TAggregate> {
  return createDomainEvent<CreateEvent<TAggregate>>(
    'Create',
    aggregate['@type'],
    aggregate.id,
    {
      aggregate,
    },
  );
}

export function createUpdateDataEvent<TAggregate extends Aggregate<TAggregate['@type']>>(
  aggregateType: TAggregate['@type'],
  aggregateId: string,
  diff: Diff<TAggregate>,
): UpdateEvent<TAggregate> {
  return createDomainEvent<UpdateEvent<TAggregate>>(
    'Update',
    aggregateType,
    aggregateId,
    {
      diff,
    },
  );
}

export function createDeleteDataEvent<TAggregate extends Aggregate<TAggregate['@type']>>(
  aggregateType: TAggregate['@type'],
  aggregateId: string,
): DeleteEvent<TAggregate> {
  return createDomainEvent<DeleteEvent<TAggregate>>(
    'Delete',
    aggregateType,
    aggregateId,
    {},
  );
}
