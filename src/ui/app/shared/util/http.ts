import { HttpClient, HttpResponse } from '@angular/common/http';
import { Action } from '@ngrx/store';
import { Observable, ObservableInput } from 'rxjs';

import { environment } from '../../../environments/environment';
import { httpGet, HttpOptions, httpPost, ObserveBodyHttpOptions, ObserveResponseHttpOptions } from '../../platform';

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
