import { ConnectableObservable, Observable, Observer, Subject, Subscription } from 'rxjs';
import { filter, map, publishReplay } from 'rxjs/operators';

import { DomainEvent, DomainEventHandlerMap, DomainEventOfType } from '../api-infrastructure.types';
import { loadEventsAsync, persistEventsAsync } from './persistence';

const allEventsSubject = new Subject<[DomainEvent<any, any>, number]>();

export class EventLog {
  static getStream<TEvent extends DomainEvent<any, TEvent['eventType']> = DomainEvent<any, TEvent['eventType']>>(
    eventKinds: TEvent['eventType'][],
  ): Observable<TEvent> {
    return Observable.create((obs: Observer<TEvent>) => {
      const replayObs = allEventsSubject.pipe(
        filter(([ev]) => eventKinds.indexOf(ev.eventType as TEvent['eventType']) >= 0),
        map(t => t as [TEvent, number]),
        publishReplay(),
      ) as ConnectableObservable<[TEvent, number]>;

      const sub1 = replayObs.connect();

      const subject = new Subject<TEvent>();

      loadEventsAsync<TEvent>(...eventKinds).then(([events, highestIndex]) => {
        for (const event of events) {
          subject.next(event);
        }

        // not using the subscription return value from this is fine since
        // we manually control the underlying subscription to the replay
        // observable
        replayObs.pipe(
          filter(([_, idx]) => idx > highestIndex),
          map(([ev]) => ev),
        ).subscribe(subject);
      }, err => subject.error(err));

      const sub2 = subject.subscribe(obs);
      return () => {
        sub1.unsubscribe();
        sub2.unsubscribe();
      };
    });
  }

  static subscribeToStream<TEvent extends DomainEvent<any, TEvent['eventType']> = DomainEvent<any, TEvent['eventType']>>(
    eventKinds: TEvent['eventType'][],
    eventHandlerMap: DomainEventHandlerMap<any, TEvent>,
  ): Subscription {
    return EventLog.getStream(eventKinds).subscribe(ev => {
      const handler = eventHandlerMap[ev.eventType];
      handler(undefined!, ev as DomainEventOfType<TEvent, TEvent['eventType']>);
    });
  }

  static async publishAsync(
    ...events: DomainEvent<any, any>[]
  ): Promise<void> {
    // ensure the events are persisted before making them visible inside the app
    const indexes = await persistEventsAsync(events);

    for (let i = 0; i < events.length; i += 1) {
      const event = events[i];
      const index = indexes[i];

      allEventsSubject.next([event, index]);
    }
  }
}
