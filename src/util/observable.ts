import { Observable, Observer, TeardownLogic } from 'rxjs';

export function createObservable<T = unknown>(fn: (observer: Observer<T>) => TeardownLogic) {
  return Observable.create(fn) as Observable<T>;
}
