import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { delay, flatMap, map } from 'rxjs/operators';

import { InitializePredicateKindsPageAction, LoadPredicateKindsPageDataAction } from './predicate-kinds.actions';
import { PredicateKindsPageDto } from './predicate-kinds.state';

@Injectable()
export class PredicateKindsPageEffects {

  @Effect()
  loadPageData$: Observable<Action> = this.actions$.pipe(
    ofType(LoadPredicateKindsPageDataAction.TYPE),
    map<Action, PredicateKindsPageDto>(() => ({

    })),
    flatMap(dto =>
      of(new InitializePredicateKindsPageAction(dto)).pipe(delay(100))
    ),
  );

  constructor(private actions$: Actions) { }
}
