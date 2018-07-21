import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { concatMap, delay, flatMap, map, skip } from 'rxjs/operators';

import { BlockUiAction, OpenUrlInNewTabAction, ReloadPageAction, ShowInformationMessageAction, UnblockUiAction } from './infrastructure.actions';
import { RootState } from './infrastructure.state';

@Injectable()
export class InfrastructureEffects {
  @Effect()
  setDocumentTitle$: Observable<Action> = this.store.pipe(
    select(s => s.infrastructure.pageTitle),
    flatMap(title => {
      this.titleService.setTitle(title);
      return [];
    }),
  );

  @Effect()
  handleUiBlocking$: Observable<Action> = this.store.pipe(
    select(s => s.infrastructure.uiIsBlocked),
    skip(1),
    map(isUiBlocked => isUiBlocked ? new BlockUiAction() : new UnblockUiAction()),
  );

  @Effect()
  showInformationMessage$: Observable<Action> = this.actions$.pipe(
    ofType(ShowInformationMessageAction.TYPE),
    map(a => a as ShowInformationMessageAction),
    // this delay is required to ensure there are no errors if
    // the action is triggered from within a change detection run
    delay(0),
    // the concatMap ensures that every message gets opened and
    // closed sequentially
    concatMap(a => {
      // TODO: properly implement this as toasts
      window.alert(a.message);
      return of();
    }),
    flatMap(() => []),
  );

  @Effect()
  openUrlInNewTab$: Observable<Action> = this.actions$.pipe(
    ofType(OpenUrlInNewTabAction.TYPE),
    map(a => (a as OpenUrlInNewTabAction).url),
    flatMap(url => {
      window.open(url, '_blank');

      return [];
    }),
  );

  @Effect()
  reloadPage$: Observable<Action> = this.actions$.pipe(
    ofType(ReloadPageAction.TYPE),
    flatMap(() => {
      window.location.reload();
      return [];
    }),
  );

  constructor(
    private actions$: Actions,
    private store: Store<RootState>,
    private titleService: Title,
  ) { }
}
