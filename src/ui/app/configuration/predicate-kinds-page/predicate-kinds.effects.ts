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
      predicateKindList: {
        items: [
          {
            name: 'All',
            // tslint:disable-next-line
            description: 'Instances of this predicate kind match all requests unconditionally. Predicates of this kind are usually used for fallback scenarios in case not other predicates match.',
            evalFunctionBody: 'return true;',
          },
          {
            name: 'test 2',
            description: 'description 2',
            evalFunctionBody: 'function body 2',
          },
        ],
      },
    })),
    flatMap(dto =>
      of(new InitializePredicateKindsPageAction(dto)).pipe(delay(100))
    ),
  );

  constructor(private actions$: Actions) { }
}
