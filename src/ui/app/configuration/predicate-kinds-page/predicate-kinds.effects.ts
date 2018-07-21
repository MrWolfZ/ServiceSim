import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { ask } from 'app/infrastructure';

import { InitializePredicateKindsPageAction, LoadPredicateKindsPageDataAction } from './predicate-kinds.actions';
import { ASK_FOR_PREDICATE_KINDS_PAGE_DTO } from './predicate-kinds.dto';

@Injectable()
export class PredicateKindsPageEffects {

  @Effect()
  loadPageData$: Observable<Action> = this.actions$.pipe(
    ofType(LoadPredicateKindsPageDataAction.TYPE),
    flatMap(() =>
      ask(
        this.http,
        ASK_FOR_PREDICATE_KINDS_PAGE_DTO,
        dto => [
          new InitializePredicateKindsPageAction(dto),
        ],
      )
    ),
  );

  constructor(private actions$: Actions, private http: HttpClient) { }
}
