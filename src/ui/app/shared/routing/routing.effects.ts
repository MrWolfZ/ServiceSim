import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';

import { RootState } from '../../app.state';

import {
  NavigateToPredicateKindsAction,
  NavigateToResponseGeneratorKindsAction,
} from './routing.actions';
import {
  createNavigateAction,
  creatPredicateKindsRouteRoute,
  creatResponseGeneratorKindsRouteRoute,
} from './routing.util';

@Injectable()
export class AppRoutingEffects {

  @Effect()
  navigateToPredicateKinds$: Observable<Action> = this.actions$.pipe(
    ofType(NavigateToPredicateKindsAction.TYPE),
    map(a => a as NavigateToPredicateKindsAction),
    withLatestFrom(this.store.select(s => s.router)),
    map(([_, routerState]) => createNavigateAction(creatPredicateKindsRouteRoute(routerState))),
  );

  @Effect()
  navigateToResponseGeneratorKinds$: Observable<Action> = this.actions$.pipe(
    ofType(NavigateToResponseGeneratorKindsAction.TYPE),
    map(a => a as NavigateToResponseGeneratorKindsAction),
    withLatestFrom(this.store.select(s => s.router)),
    map(([_, routerState]) => createNavigateAction(creatResponseGeneratorKindsRouteRoute(routerState))),
  );

  constructor(private actions$: Actions, private store: Store<RootState>) { }
}
