import { LocationStrategy } from '@angular/common';
import { Directive, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Action, Store } from '@ngrx/store';

import { RootState } from 'app/app.state';
import { RouterState } from 'app/infrastructure';

import { AbstractLinkDirective } from './link.directive';
import { NavigateToResponseGeneratorKindsAction } from './routing.actions';
import { Route } from './routing.state';
import { creatResponseGeneratorKindsRouteRoute } from './routing.util';

// tslint:disable:directive-selector

@Directive({
  selector: 'a[responseGeneratorKindsLink]',
})
export class ResponseGeneratorKindsLinkDirective extends AbstractLinkDirective {
  constructor(
    store: Store<RootState>,
    router: Router,
    locationStrategy: LocationStrategy,
    elementRef: ElementRef,
  ) {
    super(store, router, locationStrategy, elementRef);
  }

  createNavigateAction(): Action {
    return new NavigateToResponseGeneratorKindsAction();
  }

  createRoute(routerState: RouterState): Route {
    return creatResponseGeneratorKindsRouteRoute(routerState);
  }
}
