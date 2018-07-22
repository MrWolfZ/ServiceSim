import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';

import { ask, tell } from 'app/infrastructure';

import {
  DeletePredicateKindAction,
  DeletePredicateKindSuccessfulAction,
  SaveEditedPredicateKindListItemAction,
  SavingEditedPredicateKindListItemSuccessfulAction,
  SubmitNewPredicateKindDialogAction,
  SubmitNewPredicateKindDialogSuccessfulAction,
} from './predicate-kind-list';
import { InitializePredicateKindsPageAction, LoadPredicateKindsPageDataAction } from './predicate-kinds.actions';
import {
  ASK_FOR_PREDICATE_KINDS_PAGE_DTO,
  createCreateNewPredicateKindCommand,
  createDeletePredicateKindCommand,
  createUpdatePredicateKindCommand,
} from './predicate-kinds.dto';

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

  @Effect()
  updatePredicateKind$: Observable<Action> = this.actions$.pipe(
    ofType(SaveEditedPredicateKindListItemAction.TYPE),
    map(a => a as SaveEditedPredicateKindListItemAction),
    flatMap(a =>
      tell(
        this.http,
        createUpdatePredicateKindCommand(a.predicateKindId, a.formValue),
        () => [
          new SavingEditedPredicateKindListItemSuccessfulAction(a.predicateKindId),
        ],
      )
    ),
  );

  @Effect()
  deletePredicateKind$: Observable<Action> = this.actions$.pipe(
    ofType(DeletePredicateKindAction.TYPE),
    map(a => a as DeletePredicateKindAction),
    flatMap(a =>
      tell(
        this.http,
        createDeletePredicateKindCommand(a.predicateKindId),
        () => [
          new DeletePredicateKindSuccessfulAction(a.predicateKindId),
        ],
      )
    ),
  );

  constructor(private actions$: Actions, private http: HttpClient) { }
}
