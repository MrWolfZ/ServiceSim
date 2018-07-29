import { HttpClient } from '@angular/common/http';
import { Action } from '@ngrx/store';
import { Observable, ObservableInput, of } from 'rxjs';
import { delay, flatMap } from 'rxjs/operators';

import { Ask, Tell } from 'app/infrastructure';
import { environment } from 'environments/environment';

import { CommonHttpOptions, httpPost, surroundWithLoadingBar, surroundWithUiBlocking } from './http';

const mockResponses: { [kind: string]: [any, number] } = {};

export function addAskMockResponse<TAsk extends Ask<TAskKind, TResponse>, TAskKind extends string, TResponse>(
  ask: TAsk,
  response: NonNullable<TAsk['dto']>,
  delayInMillis = 300,
) {
  mockResponses[ask.kind] = [response, delayInMillis];
}

export function ask<TAskKind extends string, TResponse>(
  http: HttpClient,
  ask: Ask<TAskKind, TResponse>,
  project: (resp: TResponse) => ObservableInput<Action>,
  options: CommonHttpOptions = {
    blocksUi: true,
    showsLoadingBar: true,
  },
): Observable<Action> {
  if (mockResponses[ask.kind]) {
    const [response, delayInMillis] = mockResponses[ask.kind];
    let obs = of(response as TResponse).pipe(flatMap(project), delay(delayInMillis));

    if (options.showsLoadingBar) {
      obs = surroundWithLoadingBar(obs);
    }

    if (options.blocksUi) {
      obs = surroundWithUiBlocking(obs);
    }

    return obs;
  }

  return httpPost(
    http,
    `${environment.apiBaseUrl}uiApi/ask`,
    JSON.stringify(ask),
    project,
    {
      blocksUi: options.blocksUi,
      showsLoadingBar: options.showsLoadingBar,
    },
  );
}

export function tell<TTellKind extends string, TResponse>(
  http: HttpClient,
  tell: Tell<TTellKind, TResponse>,
  project: (resp: TResponse) => ObservableInput<Action>,
  options: CommonHttpOptions = {
    blocksUi: false,
    showsLoadingBar: false,
  },
): Observable<Action> {
  return httpPost(
    http,
    `${environment.apiBaseUrl}uiApi/tell`,
    JSON.stringify(tell),
    project,
    {
      blocksUi: options.blocksUi,
      showsLoadingBar: options.showsLoadingBar,
    },
  );
}
