import { ConnectableObservable, Subject, Subscription } from 'rxjs';
import { map, publishReplay, refCount } from 'rxjs/operators';
import { Event } from 'src/domain/infrastructure/ddd';
import { ServiceAggregate } from 'src/domain/service';
import { registerEventHandler } from 'src/infrastructure/bus';
import { createObservable } from 'src/util/observable';
import { getAllServices } from './get-all-services';

export const allServices$ = createObservable<ServiceAggregate[]>(obs => {
  const subject = new Subject<ServiceAggregate[]>();
  const sub = subject.subscribe(obs);

  const allEventsOfType = createObservable<Event<any>>(obs => {
    return registerEventHandler('never', evt => obs.next(evt));
  });

  const replayObs = allEventsOfType.pipe(publishReplay(1)) as ConnectableObservable<Event<any>>;

  const replaySub = replayObs.connect();
  let allEventsSub = new Subscription();

  getAllServices().then(services => {
    subject.next(services);

    // TODO: merge events into services array
    replayObs.pipe(
      map(() => services),
    ).subscribe(subject);

    replaySub.unsubscribe();

    allEventsSub = allEventsOfType.pipe(
      map(() => services),
    ).subscribe(subject);

  }, err => subject.error(err));

  return () => {
    replaySub.unsubscribe();
    allEventsSub.unsubscribe();
    sub.unsubscribe();
  };
}).pipe(
  publishReplay(1),
  refCount(),
);
