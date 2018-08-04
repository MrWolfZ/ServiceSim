import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';

import { RootState } from 'app/app.state';

import {
  NavigateToPredicateTemplatesAction,
  NavigateToPredicateTreeAction,
  NavigateToResponseGeneratorTemplatesAction,
} from './routing.actions';
import {
  createNavigateAction,
  creatPredicateTemplatesRouteRoute,
  creatPredicateTreeRouteRoute,
  creatResponseGeneratorTemplatesRouteRoute,
} from './routing.util';

@Injectable()
export class RoutingEffects {

  @Effect()
  navigateToPredicateTree$: Observable<Action> = this.actions$.pipe(
    ofType(NavigateToPredicateTreeAction.TYPE),
    map(a => a as NavigateToPredicateTreeAction),
    withLatestFrom(this.store.select(s => s.router)),
    map(([_, routerState]) => createNavigateAction(creatPredicateTreeRouteRoute(routerState))),
  );

  @Effect()
  navigateToPredicateTemplates$: Observable<Action> = this.actions$.pipe(
    ofType(NavigateToPredicateTemplatesAction.TYPE),
    map(a => a as NavigateToPredicateTemplatesAction),
    withLatestFrom(this.store.select(s => s.router)),
    map(([_, routerState]) => createNavigateAction(creatPredicateTemplatesRouteRoute(routerState))),
  );

  @Effect()
  navigateToResponseGeneratorTemplates$: Observable<Action> = this.actions$.pipe(
    ofType(NavigateToResponseGeneratorTemplatesAction.TYPE),
    map(a => a as NavigateToResponseGeneratorTemplatesAction),
    withLatestFrom(this.store.select(s => s.router)),
    map(([_, routerState]) => createNavigateAction(creatResponseGeneratorTemplatesRouteRoute(routerState))),
  );

  constructor(private actions$: Actions, private store: Store<RootState>) { }
}
