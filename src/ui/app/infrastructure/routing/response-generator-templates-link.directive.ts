import { LocationStrategy } from '@angular/common';
import { Directive, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Action, Store } from '@ngrx/store';

import { RootState } from 'app/app.state';
import { RouterState } from 'app/infrastructure';

import { AbstractLinkDirective } from './link.directive';
import { NavigateToResponseGeneratorTemplatesAction } from './routing.actions';
import { Route } from './routing.state';
import { creatResponseGeneratorTemplatesRouteRoute } from './routing.util';

// tslint:disable:directive-selector

@Directive({
  selector: 'a[responseGeneratorTemplatesLink]',
})
export class ResponseGeneratorTemplatesLinkDirective extends AbstractLinkDirective {
  constructor(
    store: Store<RootState>,
    router: Router,
    locationStrategy: LocationStrategy,
    elementRef: ElementRef,
  ) {
    super(store, router, locationStrategy, elementRef);
  }

  createNavigateAction(): Action {
    return new NavigateToResponseGeneratorTemplatesAction();
  }

  createRoute(routerState: RouterState): Route {
    return creatResponseGeneratorTemplatesRouteRoute(routerState);
  }
}
