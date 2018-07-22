import { ConnectableObservable, Observable, Observer, Subject } from 'rxjs';
import { filter, map, publishReplay } from 'rxjs/operators';

import { DomainEvent } from '../domain-event';
import { loadEventsAsync, persistEventsAsync } from './persistence';

const allEventsSubject = new Subject<[DomainEvent, number]>();

export class EventLog {
  static getStream<TEvent extends DomainEvent<TEvent['kind']> = DomainEvent>(
    ...eventKinds: TEvent['kind'][]
  ): Observable<TEvent> {
    return Observable.create((obs: Observer<TEvent>) => {
      const replayObs = allEventsSubject.pipe(
        filter(([ev]) => eventKinds.indexOf(ev.kind) >= 0),
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

  static async publishAsync(
    ...events: DomainEvent[]
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
