import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { ActionsSubject, select, Store } from '@ngrx/store';
import { take } from 'rxjs/operators';

import { handleInitializationAndApiError, NavigateAction } from './infrastructure';

import { AppInitializedAction, LoadAppDataAction } from './app.actions';
import { RootState } from './app.state';

@Injectable()
export class AppGuard implements CanActivate {

  constructor(private store: Store<RootState>, private actionsSubject: ActionsSubject) { }

  canActivate(route: ActivatedRouteSnapshot) {
    // we must ensure that the error page is always reachable
    let isErrorNavigation = false;
    this.store.pipe(
      select(s => s.router.pendingNavigation!.path),
      take(1),
    ).subscribe(p => isErrorNavigation = p === '/infrastructure/error');

    if (isErrorNavigation) {
      return true;
    }

    // if the navigation is not to the error page we strip the api error from the URL
    if (route.queryParams.apiError) {
      this.store.pipe(
        select(s => s.router.pendingNavigation!),
        take(1),
      ).subscribe(nav => {
        this.actionsSubject.next(new NavigateAction(
          [nav.path],
          {
            ...nav.queryParams,
            // tslint:disable-next-line:no-null-keyword
            apiError: null,
          },
        ));
      });

      return false;
    }

    let isInitialized = false;

    this.store.pipe(
      select(s => s.infrastructure.isInitialized),
      take(1),
    ).subscribe(b => isInitialized = b);

    if (isInitialized) {
      return true;
    }

    this.actionsSubject.next(new LoadAppDataAction());
    return handleInitializationAndApiError(this.actionsSubject, AppInitializedAction.TYPE);
  }
}
