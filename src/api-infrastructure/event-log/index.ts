import { ConnectableObservable, empty, Observable, Observer, Subject, Subscription } from 'rxjs';
import { filter, map, publishReplay } from 'rxjs/operators';
import { Diff } from '../../util';
import { Aggregate, CreateEvent, DataEvent, DeleteEvent, DomainEvent, DomainEventOfType, Event, UpdateEvent } from '../api-infrastructure.types';
import { EventLogPersistenceAdapter } from './persistence/adapter';
import { inMemoryEventLogPersistenceAdapter } from './persistence/in-memory';

const allEventsSubject = new Subject<[Event<any>, number]>();
let adapter: EventLogPersistenceAdapter = inMemoryEventLogPersistenceAdapter;

export async function initializeEventLog(options: { adapter?: EventLogPersistenceAdapter } = {}) {
  if (options.adapter) {
    adapter = options.adapter;
  }

  if (adapter.initialize) {
    await adapter.initialize();
  }
}

export async function publishEvents<TEvent extends Event<TEvent['eventType']> = Event<TEvent['eventType']>>(...events: TEvent[]) {
  // ensure the events are persisted before making them visible inside the app
  const indexes = await persistEvents(events);

  for (let i = 0; i < events.length; i += 1) {
    const event = events[i];
    const index = indexes[i];

    allEventsSubject.next([event, index]);
  }
}

export function getUnfilteredLiveEventStream<TEventType extends string = string>(): Observable<Event<TEventType>> {
  return allEventsSubject.pipe(map(([ev]) => ev));
}

export function getLiveEventStream<TEvent extends Event<TEvent['eventType']>>(
  ...eventTypes: TEvent['eventType'][]
): Observable<TEvent> {
  return allEventsSubject.pipe(
    map(([ev]) => ev),
    map(t => t as TEvent),
    filter(ev => eventTypes.indexOf(ev.eventType as TEvent['eventType']) >= 0),
  );
}

export function getLiveDomainEventStream<TEvent extends DomainEvent<TEvent['aggregateType'], TEvent['eventType']>>(
  aggregateType: TEvent['aggregateType'],
  ...eventTypes: TEvent['eventType'][]
): Observable<TEvent> {
  return allEventsSubject.pipe(
    map(([ev]) => ev),
    map(t => t as TEvent),
    filter(ev => ev.aggregateType === aggregateType),
    filter(ev => eventTypes.indexOf(ev.eventType as TEvent['eventType']) >= 0),
  );
}

export function getLiveDataEventStream<
  TAggregate extends Aggregate<TAggregate['@type']>,
  TEvent extends DataEvent<TAggregate, TEvent['eventType']>,
  >(
    aggregateType: TEvent['aggregateType'],
): Observable<TEvent> {
  return allEventsSubject.pipe(
    map(([ev]) => ev),
    map(t => t as TEvent),
    filter(ev => ev.aggregateType === aggregateType),
  );
}

export function getDomainAndDataEventStreamWithReplay<
  TAggregate extends Aggregate<TAggregate['@type']>,
  TEvent extends DomainEvent<TEvent['aggregateType'], TEvent['eventType']>,
  >(
    aggregateTypes: TEvent['aggregateType'][],
    eventTypes: TEvent['eventType'][],
    allAfterSeqNr: number = 0,
): Observable<TEvent> {
  if (aggregateTypes.length === 0 || eventTypes.length === 0) {
    return empty();
  }

  return Observable.create((obs: Observer<TEvent>) => {
    const subject = new Subject<TEvent>();
    const sub = subject.subscribe(obs);

    const allEventsOfType = allEventsSubject.pipe(
      map(t => t as [TEvent, number]),
      filter(([_, seqNr]) => seqNr > allAfterSeqNr),
      filter(([ev]) => eventTypes.indexOf(ev.eventType as TEvent['eventType']) >= 0),
      filter(([ev]) => aggregateTypes.indexOf(ev.aggregateType as TEvent['aggregateType']) >= 0),
    );

    const replayObs = allEventsOfType.pipe(publishReplay()) as ConnectableObservable<[TEvent, number]>;

    const replaySub = replayObs.connect();
    let allEventsSub = new Subscription();

    loadEvents<TEvent>(eventTypes, aggregateTypes, allAfterSeqNr).then(
      ([events, highestSeqNr]) => {
        for (const event of events) {
          subject.next(event);
        }

        replayObs.pipe(
          filter(([_, seqNr]) => seqNr > highestSeqNr),
          map(([ev]) => ev),
        ).subscribe(subject);

        replaySub.unsubscribe();

        allEventsSub = allEventsOfType.pipe(
          filter(([_, seqNr]) => seqNr > highestSeqNr),
          map(([ev]) => ev),
        ).subscribe(subject);

      },
      err => subject.error(err),
    );

    return () => {
      replaySub.unsubscribe();
      allEventsSub.unsubscribe();
      sub.unsubscribe();
    };
  });
}

export function createEvent<TEventType extends string = string>(eventType: TEventType): Event<TEventType> {
  return {
    eventType,
    occurredOnEpoch: Date.now(),
  };
}

export function createDomainEvent<
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
}

export function createCreateDataEvent<TAggregate extends Aggregate<TAggregate['@type']>>(aggregate: TAggregate): CreateEvent<TAggregate> {
  return {
    eventType: 'Create',
    aggregateType: aggregate['@type'],
    aggregateId: aggregate.id,
    occurredOnEpoch: Date.now(),
    aggregate,
  };
}

export function createUpdateDataEvent<TAggregate extends Aggregate<TAggregate['@type']>>(
  aggregateType: TAggregate['@type'],
  aggregateId: string,
  diff: Diff<TAggregate>,
): UpdateEvent<TAggregate> {
  return {
    eventType: 'Update',
    aggregateType,
    aggregateId,
    occurredOnEpoch: Date.now(),
    diff,
  };
}

export function createDeleteDataEvent<TAggregate extends Aggregate<TAggregate['@type']>>(
  aggregateType: TAggregate['@type'],
  aggregateId: string,
): DeleteEvent<TAggregate> {
  return {
    eventType: 'Delete',
    aggregateType,
    aggregateId,
    occurredOnEpoch: Date.now(),
  };
}

export async function persistEvents(events: Event<any>[]): Promise<number[]> {
  return await adapter.persistEvents(
    events.map(ev => ({
      eventType: ev.eventType,
      aggregateType: (ev as DomainEvent<any, any>).aggregateType,
      body: ev,
    })),
  );
}

export async function loadEvents<TEvent extends Event<any>>(
  eventTypes: string[],
  aggregateTypes?: string[],
  allAfterSeqNr = 0,
): Promise<[TEvent[], number]> {
  const storedEvents = await adapter.loadEvents(eventTypes, aggregateTypes, allAfterSeqNr);
  return [storedEvents.map(se => se.body as TEvent), storedEvents.reduce((l, ev) => Math.max(l, ev.seqNr), allAfterSeqNr)];
}

export async function dropAllEvents() {
  await adapter.dropAll();
}