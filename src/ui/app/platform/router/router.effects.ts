import { Injectable } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, Router, RouterStateSnapshot, RoutesRecognized } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { of } from 'rxjs';
import { filter, flatMap, map, tap, withLatestFrom } from 'rxjs/operators';

import { RootState } from '../platform.state';
import { deepEquals } from '../util';
import {
  MergeQueryParamsAction,
  NavigateAction,
  NavigationCanceledAction,
  NavigationEndedAction,
  NavigationFailedAction,
  NavigationStartedAction,
  RoutesRecognizedAction,
} from './router.actions';
import { RouterStateSerializer } from './router.serializer';

function areQueryParamsEqual(actionQueryParams: any, routerQueryParams: any) {
  return Object.keys(actionQueryParams)
    // if the query param has the value null, it is removed from the path by angular.
    // tslint:disable-next-line:no-null-keyword
    .every(k => actionQueryParams[k] == null ? !(k in routerQueryParams) : deepEquals(actionQueryParams[k], routerQueryParams[k]));
}

@Injectable()
export class RouterEffects {

  @Effect()
  navigate$ = this.actions$.pipe(
    ofType(NavigateAction.TYPE),
    map(a => a as NavigateAction),
    tap(({ path, queryParams, extras }) => this.router.navigate(path, { queryParams, ...extras })),
    flatMap(() => []),
  );

  @Effect()
  mergeQueryParams$ = this.actions$.pipe(
    ofType(MergeQueryParamsAction.TYPE),
    map(a => a as MergeQueryParamsAction),
    withLatestFrom(this.store.select(s => s.router)),
    filter(([a, r]) => !areQueryParamsEqual(a.queryParams, r.queryParams)),
    tap(([a, r]) =>
      this.router.navigate(
        [a.usePendingNavigation ? r.pendingNavigation!.path : r.path],
        {
          queryParams: {
            ...(a.usePendingNavigation ? r.pendingNavigation!.queryParams : r.queryParams),
            ...a.queryParams,
          },
          replaceUrl: true,
        },
      )
    ),
    flatMap(() => []),
  );

  @Effect()
  handleRoutesRecognized$ = this.router.events.pipe(
    filter(e => e instanceof RoutesRecognized),
    map(e => e as RoutesRecognized),
    map(e => new RoutesRecognizedAction(e.id)),
  );

  @Effect()
  handleNavigationEnded$ = this.router.events.pipe(
    filter(e => e instanceof NavigationEnd),
    map(e => e as NavigationEnd),
    map(e => new NavigationEndedAction(e.id)),
  );

  @Effect()
  handleNavigationCanceled$ = this.router.events.pipe(
    filter(e => e instanceof NavigationCancel),
    map(e => e as NavigationCancel),
    map(e => new NavigationCanceledAction(e.id, e.reason)),
  );

  @Effect()
  handleNavigationError$ = this.router.events.pipe(
    filter(e => e instanceof NavigationError),
    map(e => e as NavigationError),
    map(e => new NavigationFailedAction(e.id, `${e.error}`)),
  );

  @Effect()
  navigateOnStateUrlChange$ = this.store.pipe(
    select(s => s.router),
    filter(s => s.url !== this.router.url && !s.navigationIsRunning),
    tap(s => this.router.navigateByUrl(s.url)),
    flatMap(() => []),
  );

  constructor(
    private actions$: Actions,
    private router: Router,
    private store: Store<RootState>,
  ) {
    const serializer = new RouterStateSerializer();
    (router as any).hooks.beforePreactivation = (
      routerState: RouterStateSnapshot,
    ) => {
      const state = serializer.serialize(routerState);
      this.store.dispatch(new NavigationStartedAction(state));
      return of(true);
    };
  }
}
