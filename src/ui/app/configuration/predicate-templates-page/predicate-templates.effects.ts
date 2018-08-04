import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';

import { ask, tell } from 'app/infrastructure';

import { PredicateTemplateDialogSubmitSuccessfulAction, SubmitPredicateTemplateDialogAction } from './predicate-template-dialog';
import { DeletePredicateTemplateAction } from './predicate-template-tile';
import { InitializePredicateTemplatesPageAction, LoadPredicateTemplatesPageDataAction } from './predicate-templates.actions';
import {
  askForPredicateTemplatesPageDto,
  createDeletePredicateTemplateCommand,
  tellToCreateOrUpdatePredicateTemplate,
} from './predicate-templates.dto';

@Injectable()
export class PredicateTemplatesPageEffects {

  @Effect()
  loadPageData$: Observable<Action> = this.actions$.pipe(
    ofType(LoadPredicateTemplatesPageDataAction.TYPE),
    flatMap(() =>
      ask(
        this.http,
        askForPredicateTemplatesPageDto(),
        dto => [
          new InitializePredicateTemplatesPageAction(dto),
        ],
      )
    ),
  );

  @Effect()
  createOrUpdatePredicateTemplate$: Observable<Action> = this.actions$.pipe(
    ofType(SubmitPredicateTemplateDialogAction.TYPE),
    map(a => a as SubmitPredicateTemplateDialogAction),
    flatMap(a =>
      tell(
        this.http,
        tellToCreateOrUpdatePredicateTemplate(a.formValue, a.templateId),
        dto => [
          new PredicateTemplateDialogSubmitSuccessfulAction(dto.templateId, a.formValue),
        ],
      )
    ),
  );

  // TODO: deal with failure
  @Effect()
  deletePredicateTemplate$: Observable<Action> = this.actions$.pipe(
    ofType(DeletePredicateTemplateAction.TYPE),
    map(a => a as DeletePredicateTemplateAction),
    flatMap(a =>
      tell(
        this.http,
        createDeletePredicateTemplateCommand(a.templateId),
        () => [],
      )
    ),
  );

  constructor(private actions$: Actions, private http: HttpClient) { }
}
