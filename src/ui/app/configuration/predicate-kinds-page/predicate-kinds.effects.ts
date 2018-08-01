import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';

import { ask, tell } from 'app/infrastructure';

import { PredicateKindDialogSubmitSuccessfulAction, SubmitPredicateKindDialogAction } from './predicate-kind-dialog';
import { DeletePredicateKindAction } from './predicate-kind-tile';
import { InitializePredicateKindsPageAction, LoadPredicateKindsPageDataAction } from './predicate-kinds.actions';
import {
  askForPredicateKindsPageDto,
  createDeletePredicateKindCommand,
  tellToCreateOrUpdatePredicateKind,
} from './predicate-kinds.dto';

@Injectable()
export class PredicateKindsPageEffects {

  @Effect()
  loadPageData$: Observable<Action> = this.actions$.pipe(
    ofType(LoadPredicateKindsPageDataAction.TYPE),
    flatMap(() =>
      ask(
        this.http,
        askForPredicateKindsPageDto(),
        dto => [
          new InitializePredicateKindsPageAction(dto),
        ],
      )
    ),
  );

  @Effect()
  createOrUpdatePredicateKind$: Observable<Action> = this.actions$.pipe(
    ofType(SubmitPredicateKindDialogAction.TYPE),
    map(a => a as SubmitPredicateKindDialogAction),
    flatMap(a =>
      tell(
        this.http,
        tellToCreateOrUpdatePredicateKind(a.formValue, a.predicateKindId),
        dto => [
          new PredicateKindDialogSubmitSuccessfulAction(dto.predicateKindId, a.formValue),
        ],
      )
    ),
  );

  // TODO: deal with failure
  @Effect()
  deletePredicateKind$: Observable<Action> = this.actions$.pipe(
    ofType(DeletePredicateKindAction.TYPE),
    map(a => a as DeletePredicateKindAction),
    flatMap(a =>
      tell(
        this.http,
        createDeletePredicateKindCommand(a.predicateKindId),
        () => [],
      )
    ),
  );

  constructor(private actions$: Actions, private http: HttpClient) { }
}
