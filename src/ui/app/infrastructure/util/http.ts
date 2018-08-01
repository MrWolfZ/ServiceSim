import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Action } from '@ngrx/store';
import { concat, Observable, ObservableInput } from 'rxjs';
import { catchError, mergeMap, startWith } from 'rxjs/operators';

import { HandleApiErrorAction } from '../error-page/error.actions';
import { DecrementUiBlockingApiCallSemaphoreAction, IncrementUiBlockingApiCallSemaphoreAction } from '../infrastructure.actions';
import { DecrementLoadingBarSemaphoreAction, IncrementLoadingBarSemaphoreAction } from '../loading-bar/loading-bar.actions';

export function surroundWithLoadingBar(obs: Observable<Action>): Observable<Action> {
  return concat(obs.pipe(startWith(new IncrementLoadingBarSemaphoreAction())), [new DecrementLoadingBarSemaphoreAction()]);
}

export function surroundWithUiBlocking(obs: Observable<Action>): Observable<Action> {
  return concat(obs.pipe(startWith(new IncrementUiBlockingApiCallSemaphoreAction())), [new DecrementUiBlockingApiCallSemaphoreAction()]);
}

export interface CommonHttpOptions {
  headers?: HttpHeaders | {
    [header: string]: string | string[];
  };
  params?: {
    [param: string]: string | string[];
  };
  showsLoadingBar?: boolean;
  blocksUi?: boolean;
  errorActionFactory?: (response: HttpErrorResponse) => ObservableInput<Action>;
}

export interface ObserveBodyHttpOptions extends CommonHttpOptions {
  observe?: 'body';
}

export interface ObserveResponseHttpOptions extends CommonHttpOptions {
  observe: 'response';
}

export type HttpOptions = ObserveBodyHttpOptions | ObserveResponseHttpOptions;

function handleResponse<TResponse = null>(
  source: Observable<HttpResponse<TResponse> | TResponse>,
  project: (resp: HttpResponse<TResponse> | TResponse) => ObservableInput<Action>,
  options: HttpOptions = {},
): Observable<Action> {
  let obs = source.pipe(
    mergeMap(project),
    catchError<Action, Action>(resp => {
      if (options.errorActionFactory) {
        return options.errorActionFactory(resp);
      }

      return [new HandleApiErrorAction(resp)];
    }),
  );

  if (options.showsLoadingBar) {
    obs = surroundWithLoadingBar(obs);
  }

  if (options.blocksUi) {
    obs = surroundWithUiBlocking(obs);
  }

  return obs;
}

export function httpGet<TResponse = null>(
  http: HttpClient,
  url: string,
  project: (resp: TResponse) => ObservableInput<Action>,
  options?: ObserveBodyHttpOptions,
): Observable<Action>;

export function httpGet<TResponse = null>(
  http: HttpClient,
  url: string,
  project: (resp: HttpResponse<TResponse>) => ObservableInput<Action>,
  options: ObserveResponseHttpOptions,
): Observable<Action>;

export function httpGet<TResponse = null>(
  http: HttpClient,
  url: string,
  project: (resp: HttpResponse<TResponse> | TResponse) => ObservableInput<Action>,
  options?: HttpOptions,
): Observable<Action>;

export function httpGet<TResponse = null>(
  http: HttpClient,
  url: string,
  project: (resp: HttpResponse<TResponse> | TResponse) => ObservableInput<Action>,
  options: HttpOptions = {},
): Observable<Action> {
  const obs = (() => {
    switch (options.observe) {
      case 'response':
        return http.get<TResponse>(url, {
          observe: 'response',
          headers: options.headers,
          params: options.params,
        });

      default:
        return http.get<TResponse>(url, {
          observe: 'body',
          headers: options.headers,
          params: options.params,
        });
    }
  })();

  return handleResponse(
    obs,
    project,
    options,
  );
}

export function httpPost<TResponse = null>(
  http: HttpClient,
  url: string,
  body: any,
  project: (resp: TResponse) => ObservableInput<Action>,
  options?: ObserveBodyHttpOptions,
): Observable<Action>;

export function httpPost<TResponse = null>(
  http: HttpClient,
  url: string,
  body: any,
  project: (resp: HttpResponse<TResponse>) => ObservableInput<Action>,
  options: ObserveResponseHttpOptions,
): Observable<Action>;

export function httpPost<TResponse = null>(
  http: HttpClient,
  url: string,
  body: any,
  project: (resp: HttpResponse<TResponse> | TResponse) => ObservableInput<Action>,
  options?: HttpOptions,
): Observable<Action>;

export function httpPost<TResponse = null>(
  http: HttpClient,
  url: string,
  body: any,
  project: (resp: HttpResponse<TResponse> | TResponse) => ObservableInput<Action>,
  options: HttpOptions = {},
): Observable<Action> {
  const obs = (() => {
    options.headers = options.headers instanceof HttpHeaders ? options.headers : new HttpHeaders(options.headers);
    options.headers = options.headers.set('content-type', 'application/json');

    switch (options.observe) {
      case 'response':
        return http.post<TResponse>(url, body, {
          observe: 'response',
          headers: options.headers,
          params: options.params,
        });

      default:
        return http.post<TResponse>(url, body, {
          observe: 'body',
          headers: options.headers,
          params: options.params,
        });
    }
  })();

  return handleResponse(
    obs,
    project,
    options,
  );
}
