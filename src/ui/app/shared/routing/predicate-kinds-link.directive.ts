import { LocationStrategy } from '@angular/common';
import { Directive, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Action, Store } from '@ngrx/store';

import { RootState } from '../../app.state';
import { RouterState } from '../../platform';

import { AbstractLinkDirective } from './link.directive';
import { NavigateToPredicateKindsAction } from './routing.actions';
import { Route } from './routing.state';
import { creatPredicateKindsRouteRoute } from './routing.util';

// tslint:disable:directive-selector

@Directive({
  selector: 'a[predicateKindsLink]',
})
export class PredicateKindsLinkDirective extends AbstractLinkDirective {
  constructor(
    store: Store<RootState>,
    router: Router,
    locationStrategy: LocationStrategy,
    elementRef: ElementRef,
  ) {
    super(store, router, locationStrategy, elementRef);
  }

  createNavigateAction(): Action {
    return new NavigateToPredicateKindsAction();
  }

  createRoute(routerState: RouterState): Route {
    return creatPredicateKindsRouteRoute(routerState);
  }
}
