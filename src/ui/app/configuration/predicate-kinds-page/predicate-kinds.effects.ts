import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { addAskMockResponse, ask } from 'app/infrastructure';

import { InitializePredicateKindsPageAction, LoadPredicateKindsPageDataAction } from './predicate-kinds.actions';
import { ASK_FOR_PAGE_DTO } from './predicate-kinds.dto';

addAskMockResponse(ASK_FOR_PAGE_DTO, {
  predicateKindList: {
    items: [
      {
        name: 'All',
        // tslint:disable-next-line
        description: 'Predicates of this kind match all requests unconditionally. They are usually used for fallback scenarios in case not other predicates match.',
        evalFunctionBody: 'return true;',
      },
      {
        name: 'test 2',
        description: 'description 2',
        evalFunctionBody: 'function body 2',
      },
    ],
  },
});

@Injectable()
export class PredicateKindsPageEffects {

  @Effect()
  loadPageData$: Observable<Action> = this.actions$.pipe(
    ofType(LoadPredicateKindsPageDataAction.TYPE),
    flatMap(() =>
      ask(
        this.http,
        ASK_FOR_PAGE_DTO,
        dto => [
          new InitializePredicateKindsPageAction(dto),
        ],
      )
    ),
  );

  constructor(private actions$: Actions, private http: HttpClient) { }
}
