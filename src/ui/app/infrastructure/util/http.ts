import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Action } from '@ngrx/store';
import { concat, Observable, ObservableInput } from 'rxjs';
import { catchError, mergeMap, startWith } from 'rxjs/operators';

import { environment } from 'environments/environment';

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
  params?: HttpParams | {
    [param: string]: string | string[];
  };
  showsLoadingBar?: boolean;
  blocksUi?: boolean;
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
    catchError<Action, Action>(resp => [new HandleApiErrorAction(resp)]),
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
          withCredentials: true,
          headers: options.headers,
          params: options.params,
        });

      default:
        return http.get<TResponse>(url, {
          observe: 'body',
          withCredentials: true,
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
    switch (options.observe) {
      case 'response':
        return http.post<TResponse>(url, body, {
          observe: 'response',
          withCredentials: true,
          headers: options.headers,
          params: options.params,
        });

      default:
        return http.post<TResponse>(url, body, {
          observe: 'body',
          withCredentials: true,
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

export function makeUiApiUrl(relativeUrl: string) {
  return `${environment.apiBaseUrl}uiapi/${relativeUrl.replace(/^\/*/, '')}`;
}

export function uiApiGet<TResponse = null>(
  http: HttpClient,
  relativeUrl: string,
  project: (resp: TResponse) => ObservableInput<Action>,
  options?: ObserveBodyHttpOptions,
): Observable<Action>;

export function uiApiGet<TResponse = null>(
  http: HttpClient,
  relativeUrl: string,
  project: (resp: HttpResponse<TResponse>) => ObservableInput<Action>,
  options: ObserveResponseHttpOptions,
): Observable<Action>;

export function uiApiGet<TResponse = null>(
  http: HttpClient,
  relativeUrl: string,
  project: (resp: HttpResponse<TResponse> | TResponse) => ObservableInput<Action>,
  options?: HttpOptions,
): Observable<Action> {
  return httpGet(http, makeUiApiUrl(relativeUrl), project, options);
}

export function uiApiPost<TResponse = null>(
  http: HttpClient,
  relativeUrl: string,
  body: any,
  project: (resp: TResponse) => ObservableInput<Action>,
  options?: ObserveBodyHttpOptions,
): Observable<Action>;

export function uiApiPost<TResponse = null>(
  http: HttpClient,
  relativeUrl: string,
  body: any,
  project: (resp: HttpResponse<TResponse>) => ObservableInput<Action>,
  options: ObserveResponseHttpOptions,
): Observable<Action>;

export function uiApiPost<TResponse = null>(
  http: HttpClient,
  relativeUrl: string,
  body: any,
  project: (resp: HttpResponse<TResponse> | TResponse) => ObservableInput<Action>,
  options?: HttpOptions,
): Observable<Action> {
  return httpPost(http, makeUiApiUrl(relativeUrl), body, project, options);
}
