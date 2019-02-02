import { ConnectableObservable, EMPTY, Observable, Observer, Subject, Subscription } from 'rxjs';
import { filter, map, publishReplay } from 'rxjs/operators';
import { Aggregate, DomainEvent, Event } from 'src/domain/infrastructure/ddd';
import { failure } from 'src/util';

export interface StoredEvent {
  seqNr: number;
  eventType: string;
  aggregateType?: string;
  body: any;
}

export interface EventLogPersistenceAdapter {
  initialize?: () => Promise<void>;
  persistEvents(eventsWithoutSeqNr: Omit<StoredEvent, 'seqNr'>[]): Promise<number[]>;
  loadEvents(eventTypes: string[], aggregateTypes?: string[], allAfterSeqNr?: number): Promise<StoredEvent[]>;
  dropAll(): Promise<void>;
}

let adapter: EventLogPersistenceAdapter | undefined;

function safeAdapter() {
  if (!adapter) {
    throw failure(`DB adapter must be set`);
  }

  return adapter;
}

export async function initializeEventLog(options: { adapter: EventLogPersistenceAdapter }) {
  adapter = options.adapter;

  if (adapter.initialize) {
    await adapter.initialize();
  }
}

const allEventsSubject = new Subject<[Event<any>, number]>();

export function getDomainAndDataEventStream<
  TAggregate extends Aggregate<TAggregate['@type']>,
  TEvent extends DomainEvent<TAggregate['@type'], TEvent['eventType']>,
  >(
    aggregateTypes: TAggregate['@type'][],
    eventTypes: TEvent['eventType'][],
    allAfterSeqNr: number = 0,
): Observable<TEvent> {
  if (aggregateTypes.length === 0 || eventTypes.length === 0) {
    return EMPTY;
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

export async function persistEvents(events: Event<any>[]) {
  const seqNrs = await safeAdapter().persistEvents(
    events.map(ev => ({
      eventType: ev.eventType,
      aggregateType: (ev as DomainEvent<any, any>).aggregateType,
      body: ev,
    })),
  );

  events.forEach((event, idx) => allEventsSubject.next([event, seqNrs[idx]]));
}

export async function loadEvents<TEvent extends Event<any>>(
  eventTypes: string[],
  aggregateTypes?: string[],
  allAfterSeqNr = 0,
): Promise<[TEvent[], number]> {
  const storedEvents = await safeAdapter().loadEvents(eventTypes, aggregateTypes, allAfterSeqNr);
  return [storedEvents.map(se => se.body as TEvent), storedEvents.reduce((l, ev) => Math.max(l, ev.seqNr), allAfterSeqNr)];
}

export async function dropAllEvents() {
  await safeAdapter().dropAll();
}
