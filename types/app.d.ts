declare type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>;
import { Observable } from 'rxjs';

declare global {
  type NonFunctionPropertyNames<T> = { [K in keyof T]: T[K] extends Function ? never : K }[keyof T];
  type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>> extends T ? T : Pick<T, NonFunctionPropertyNames<T>>;
  type NonObservablePropertyNames<T> = { [K in keyof T]: T[K] extends Observable<any> ? never : K }[keyof T];
  type NonObservableProperties<T> = Pick<T, NonObservablePropertyNames<T>> extends T ? T : Pick<T, NonObservablePropertyNames<T>>;
  type ObservablePropertyNames<T> = { [K in keyof T]: T[K] extends Observable<any> ? K : never }[keyof T];
  type ObservableProperties<T> = Pick<T, ObservablePropertyNames<T>> extends T ? T : Pick<T, ObservablePropertyNames<T>>;
  type ResolvedObservableProperties<T> = { [K in keyof T]: T[K] extends Observable<infer U> ? U | undefined : never };
  type NonUndefined<T> = Exclude<T, undefined>;
  type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;
  type Exact<A, B = {}> = A & Record<keyof Omit<B, keyof A>, never>;
}
