import { LocationStrategy } from '@angular/common';
import { Directive, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Action, Store } from '@ngrx/store';

import { RootState } from 'app/app.state';
import { RouterState } from 'app/infrastructure';

import { AbstractLinkDirective } from './link.directive';
import { NavigateToPredicateTreeAction } from './routing.actions';
import { Route } from './routing.state';
import { creatPredicateTreeRouteRoute } from './routing.util';

// tslint:disable:directive-selector

@Directive({
  selector: 'a[predicateTreeLink]',
})
export class PredicateTreeLinkDirective extends AbstractLinkDirective {
  constructor(
    store: Store<RootState>,
    router: Router,
    locationStrategy: LocationStrategy,
    elementRef: ElementRef,
  ) {
    super(store, router, locationStrategy, elementRef);
  }

  createNavigateAction(): Action {
    return new NavigateToPredicateTreeAction();
  }

  createRoute(routerState: RouterState): Route {
    return creatPredicateTreeRouteRoute(routerState);
  }
}
