import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { addAskMockResponse, ask } from 'app/infrastructure';

import { InitializePredicateTreePageAction, LoadPredicateTreePageDataAction } from './predicate-tree.actions';
import { ASK_FOR_PREDICATE_TREE_PAGE_DTO } from './predicate-tree.dto';

addAskMockResponse(ASK_FOR_PREDICATE_TREE_PAGE_DTO, {

});

@Injectable()
export class PredicateTreePageEffects {

  @Effect()
  loadPageData$: Observable<Action> = this.actions$.pipe(
    ofType(LoadPredicateTreePageDataAction.TYPE),
    flatMap(() =>
      ask(
        this.http,
        ASK_FOR_PREDICATE_TREE_PAGE_DTO,
        dto => [
          new InitializePredicateTreePageAction(dto),
        ],
      )
    ),
  );

  constructor(private actions$: Actions, private http: HttpClient) { }
}
