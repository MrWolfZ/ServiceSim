import { LocationStrategy } from '@angular/common';
import { Directive, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Action, Store } from '@ngrx/store';

import { RootState } from 'app/app.state';
import { RouterState } from 'app/infrastructure';

import { AbstractLinkDirective } from './link.directive';
import { NavigateToPredicateTemplatesAction } from './routing.actions';
import { Route } from './routing.state';
import { creatPredicateTemplatesRouteRoute } from './routing.util';

// tslint:disable:directive-selector

@Directive({
  selector: 'a[predicateTemplatesLink]',
})
export class PredicateTemplatesLinkDirective extends AbstractLinkDirective {
  constructor(
    store: Store<RootState>,
    router: Router,
    locationStrategy: LocationStrategy,
    elementRef: ElementRef,
  ) {
    super(store, router, locationStrategy, elementRef);
  }

  createNavigateAction(): Action {
    return new NavigateToPredicateTemplatesAction();
  }

  createRoute(routerState: RouterState): Route {
    return creatPredicateTemplatesRouteRoute(routerState);
  }
}
