import { ActivatedRouteSnapshot, Params, RouterStateSnapshot } from '@angular/router';

import { SerializedRouterStateSnapshot } from './router.state';

function getRouteParamsRecursively(route: ActivatedRouteSnapshot): Params {
  return route.children.reduce((p, r) => ({ ...p, ...getRouteParamsRecursively(r) }), route.params);
}

function getRoutePathPartsRecursively(route: ActivatedRouteSnapshot): string[] {
  return route.children.reduce((parts, s) => [...parts, ...getRoutePathPartsRecursively(s)], route.url.map(s => s.path));
}

export class RouterStateSerializer {
  serialize(routerState: RouterStateSnapshot): SerializedRouterStateSnapshot {
    const { url } = routerState;
    const pathParts = getRoutePathPartsRecursively(routerState.root);
    const path = `/${pathParts.join('/')}`;
    const params = getRouteParamsRecursively(routerState.root);
    const queryParams = routerState.root.queryParams;

    return { url, path, params, queryParams };
  }
}
