import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { delay, flatMap, map } from 'rxjs/operators';

import { InitializeResponseGeneratorTemplatesPageAction, LoadResponseGeneratorTemplatesPageDataAction } from './response-generator-templates.actions';
import { ResponseGeneratorTemplatesPageDto } from './response-generator-templates.state';

@Injectable()
export class ResponseGeneratorTemplatesPageEffects {

  @Effect()
  loadPageData$: Observable<Action> = this.actions$.pipe(
    ofType(LoadResponseGeneratorTemplatesPageDataAction.TYPE),
    map<Action, ResponseGeneratorTemplatesPageDto>(() => ({

    })),
    flatMap(dto =>
      of(new InitializeResponseGeneratorTemplatesPageAction(dto)).pipe(delay(100))
    ),
  );

  constructor(private actions$: Actions) { }
}
