import { Observable, Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { DataEvent, DomainEvent, DomainEventOfType, Event } from './api-infrastructure.types';

const allEventsSubject = new Subject<Event<any>>();

export const eventBus = {
  publish<TEvent extends Event<TEvent['eventType']> = Event<TEvent['eventType']>>(event: TEvent) {
    allEventsSubject.next(event);
  },

  getUnfilteredEventStream<TEventType extends string = string>(): Observable<Event<TEventType>> {
    return allEventsSubject;
  },

  getEventStream<TEvent extends Event<TEvent['eventType']> = Event<TEvent['eventType']>>(
    ...eventTypes: TEvent['eventType'][]
  ): Observable<TEvent> {
    return allEventsSubject.pipe(
      map(t => t as TEvent),
      filter(ev => eventTypes.indexOf(ev.eventType as TEvent['eventType']) >= 0),
    );
  },

  getDomainEventStream<TEvent extends DomainEvent<TEvent['aggregateType'], TEvent['eventType']> = DomainEvent<TEvent['aggregateType'], TEvent['eventType']>>(
    aggregateType: TEvent['aggregateType'],
    ...eventTypes: TEvent['eventType'][]
  ): Observable<TEvent> {
    return allEventsSubject.pipe(
      map(t => t as TEvent),
      filter(ev => ev.aggregateType === aggregateType),
      filter(ev => eventTypes.indexOf(ev.eventType as TEvent['eventType']) >= 0),
    );
  },

  getDataEventStream<TEvent extends DataEvent<TEvent['aggregate'], TEvent['eventType']> = DataEvent<TEvent['aggregate'], TEvent['eventType']>>(
    aggregateType: TEvent['aggregateType'],
  ): Observable<TEvent> {
    return allEventsSubject.pipe(
      map(t => t as TEvent),
      filter(ev => ev.aggregateType === aggregateType),
    );
  },

  createEvent<TEventType extends string = string>(eventType: TEventType): Event<TEventType> {
    return {
      eventType,
      occurredOnEpoch: Date.now(),
    };
  },

  createDomainEvent<
    TEvent extends DomainEvent<TEvent['aggregateType'], TEvent['eventType']>,
    // tslint:disable-next-line:max-line-length
    TCustomProps extends Omit<DomainEventOfType<TEvent, TEvent['eventType']>, Exclude<keyof DomainEvent<TEvent['aggregateType'], TEvent['eventType']>, 'aggregateId'>>,
    >(
      eventType: TEvent['eventType'],
      aggregateType: TEvent['aggregateType'],
      // tslint:disable-next-line:max-line-length
      customProps: TCustomProps & Exact<Omit<DomainEventOfType<TEvent, TEvent['eventType']>, Exclude<keyof DomainEvent<TEvent['aggregateType'], TEvent['eventType']>, 'aggregateId'>>, TCustomProps>,
  ): TEvent {
    const domainEventProps: Omit<DomainEvent<TEvent['aggregateType'], TEvent['eventType']>, 'aggregateId'> = {
      eventType,
      aggregateType,
      occurredOnEpoch: Date.now(),
    };

    return {
      ...domainEventProps,
      ...customProps as any,
    };
  },
};
