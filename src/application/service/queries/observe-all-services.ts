import { ConnectableObservable, Subject, Subscription } from 'rxjs';
import { map, publishReplay, refCount, tap } from 'rxjs/operators';
import { Aggregate, CreateEvent, DataEvents, DeleteEvent, FullUpdateEvent, UpdateEvent } from 'src/domain/infrastructure/ddd';
import { SERVICE_AGGREGATE_TYPE, ServiceAggregate } from 'src/domain/service';
import { registerDomainEventHandler, registerEventHandler } from 'src/infrastructure/bus';
import { applyDiff, assertNever } from 'src/util';
import { createObservable } from 'src/util/observable';
import { getAllServices } from './get-all-services';

// TODO: generalize and abstract into util function
export const allServices$ = createObservable<ServiceAggregate[]>(obs => {
  const subject = new Subject<ServiceAggregate[]>();
  const sub = subject.subscribe(obs);

  const allEventsOfType = createObservable<DataEvents<ServiceAggregate>>(obs => {
    const unsub1 = registerDomainEventHandler<CreateEvent<ServiceAggregate>>(SERVICE_AGGREGATE_TYPE, 'Create', evt => obs.next(evt));
    const unsub2 = registerDomainEventHandler<UpdateEvent<ServiceAggregate>>(SERVICE_AGGREGATE_TYPE, 'Update', evt => obs.next(evt));
    const unsub3 = registerDomainEventHandler<FullUpdateEvent<ServiceAggregate>>(SERVICE_AGGREGATE_TYPE, 'FullUpdate', evt => obs.next(evt));
    const unsub4 = registerDomainEventHandler<DeleteEvent<ServiceAggregate>>(SERVICE_AGGREGATE_TYPE, 'Delete', evt => obs.next(evt));

    return () => {
      unsub1();
      unsub2();
      unsub3();
      unsub4();
    };
  });

  const resetEvents = createObservable(obs => registerEventHandler('reset-to-default-data-start', evt => obs.next(evt)));

  const replayObs = allEventsOfType.pipe(publishReplay(1)) as ConnectableObservable<DataEvents<ServiceAggregate>>;

  const replaySub = replayObs.connect();
  let allEventsSub = new Subscription();
  let resetEventsSub = new Subscription();

  getAllServices().then(services => {
    subject.next(services.slice(0));

    const indexMap: Dictionary<number> = {};
    services.forEach((s, idx) => indexMap[s.id] = idx);

    replayObs.pipe(
      tap(evt => handleDataEvent(services, indexMap, evt)),
      map(() => services.slice(0)),
    ).subscribe(subject);

    replaySub.unsubscribe();

    allEventsSub = allEventsOfType.pipe(
      tap(evt => handleDataEvent(services, indexMap, evt)),
      map(() => services.slice(0)),
    ).subscribe(subject);

    resetEventsSub = resetEvents.pipe(
      tap(() => services.splice(0, services.length)),
      map(() => services.slice(0)),
    ).subscribe(subject);

  }, err => subject.error(err));

  return () => {
    replaySub.unsubscribe();
    allEventsSub.unsubscribe();
    resetEventsSub.unsubscribe();
    sub.unsubscribe();
  };
}).pipe(
  publishReplay(1),
  refCount(),
);

function handleDataEvent<TAggregate extends Aggregate<TAggregate['@type']>>(
  aggregates: TAggregate[],
  indexMap: Dictionary<number>,
  event: DataEvents<TAggregate>,
) {
  switch (event.eventType) {
    case 'Create':
      // even though this is a create event, we check if we already know the object to prevent race conditions
      if (indexMap[event.aggregateId] >= 0) {
        aggregates.splice(indexMap[event.aggregateId], 1, event.aggregate);
        break;
      }

      const newLength = aggregates.push(event.aggregate);
      indexMap[event.aggregateId] = newLength - 1;
      break;

    case 'Update':
      const oldAggregate = aggregates[indexMap[event.aggregateId]];
      aggregates.splice(indexMap[event.aggregateId], 1, applyDiff(oldAggregate, event.diff));
      break;

    case 'FullUpdate':
      aggregates.splice(indexMap[event.aggregateId], 1, event.aggregate);
      break;

    case 'Delete':
      aggregates.splice(indexMap[event.aggregateId], 1);
      delete indexMap[event.aggregateId];
      break;

    default:
      assertNever(event);
  }
}
