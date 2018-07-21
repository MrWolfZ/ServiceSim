import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { delay, flatMap, map } from 'rxjs/operators';

import { InitializeResponseGeneratorsPageAction, LoadResponseGeneratorsPageDataAction } from './response-generators.actions';
import { ResponseGeneratorsPageDto } from './response-generators.state';

@Injectable()
export class ResponseGeneratorsPageEffects {

  @Effect()
  loadPageData$: Observable<Action> = this.actions$.pipe(
    ofType(LoadResponseGeneratorsPageDataAction.TYPE),
    map<Action, ResponseGeneratorsPageDto>(() => ({

    })),
    flatMap(dto =>
      of(new InitializeResponseGeneratorsPageAction(dto)).pipe(delay(100))
    ),
  );

  constructor(private actions$: Actions) { }
}
