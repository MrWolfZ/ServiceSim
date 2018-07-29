import { LocationStrategy } from '@angular/common';
import { Router } from '@angular/router';
import { NavigateAction, Navigation, RouterState } from '../router';

import {
  CONFIGURATION_MODULE_PATH,
  PREDICATE_KINDS_PAGE_PATH,
  PREDICATE_TREE_PAGE_PATH,
  RESPONSE_GENERATOR_KINDS_PAGE_PATH,
  Route,
} from './routing.state';

// tslint:disable:no-null-keyword (required for correct query param objects)

export function createNavigateAction(route: Route, replaceUrl = false) {
  return new NavigateAction(route.pathParts, route.queryParams, {
    replaceUrl,
  });
}

function getPreviousQueryParams(state: RouterState, navFilter: (nav: Navigation) => boolean): object {
  const currentNavigation: Navigation = {
    navigationId: state.navigationId,
    url: state.url,
    path: state.path,
    params: state.params,
    queryParams: state.queryParams,
  };

  if (navFilter(currentNavigation)) {
    return currentNavigation.queryParams;
  }

  // written as plain for loop for performance reasons
  for (let i = state.history.length - 1; i >= 0; i -= 1) {
    const nav = state.history[i];

    if (navFilter(nav)) {
      return nav.queryParams;
    }
  }

  return {};
}

export function creatPredicateTreeRouteRoute(state: RouterState): Route {
  const previousQueryParams = getPreviousQueryParams(
    state,
    n => n.path.includes(`/${CONFIGURATION_MODULE_PATH}/${PREDICATE_TREE_PAGE_PATH}`),
  );

  return {
    pathParts: [CONFIGURATION_MODULE_PATH, PREDICATE_TREE_PAGE_PATH],
    queryParams: previousQueryParams,
  };
}

export function creatPredicateKindsRouteRoute(state: RouterState): Route {
  const previousQueryParams = getPreviousQueryParams(
    state,
    n => n.path.includes(`/${CONFIGURATION_MODULE_PATH}/${PREDICATE_KINDS_PAGE_PATH}`),
  );

  return {
    pathParts: [CONFIGURATION_MODULE_PATH, PREDICATE_KINDS_PAGE_PATH],
    queryParams: previousQueryParams,
  };
}

export function creatResponseGeneratorKindsRouteRoute(state: RouterState): Route {
  const previousQueryParams = getPreviousQueryParams(
    state,
    n => n.path.includes(`/${CONFIGURATION_MODULE_PATH}/${RESPONSE_GENERATOR_KINDS_PAGE_PATH}`),
  );

  return {
    pathParts: [CONFIGURATION_MODULE_PATH, RESPONSE_GENERATOR_KINDS_PAGE_PATH],
    queryParams: previousQueryParams,
  };
}

export function createExternalUrl(route: Route, router: Router, locationStrategy: LocationStrategy): string {
  const urlTree = router.createUrlTree(route.pathParts, {
    queryParams: route.queryParams,
  });

  return locationStrategy.prepareExternalUrl(router.serializeUrl(urlTree));
}
