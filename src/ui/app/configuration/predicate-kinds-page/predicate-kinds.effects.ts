import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';

import { ask, tell } from 'app/infrastructure';

import { SubmitNewPredicateKindDialogAction, SubmitNewPredicateKindDialogSuccessfulAction } from './predicate-kind-list';
import { InitializePredicateKindsPageAction, LoadPredicateKindsPageDataAction } from './predicate-kinds.actions';
import { ASK_FOR_PREDICATE_KINDS_PAGE_DTO, createCreateNewPredicateKindCommand } from './predicate-kinds.dto';

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

  @Effect()
  createNewPredicateKind$: Observable<Action> = this.actions$.pipe(
    ofType(SubmitNewPredicateKindDialogAction.TYPE),
    map(a => a as SubmitNewPredicateKindDialogAction),
    flatMap(a =>
      tell(
        this.http,
        createCreateNewPredicateKindCommand(a.formValue),
        dto => [
          new SubmitNewPredicateKindDialogSuccessfulAction(dto.predicateKindId),
        ],
      )
    ),
  );

  constructor(private actions$: Actions, private http: HttpClient) { }
}
