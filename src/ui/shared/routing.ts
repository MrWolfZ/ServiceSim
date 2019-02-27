import { failure } from 'src/util/result-monad';
import VueRouter, { RawLocation } from 'vue-router';

let activeRouter: VueRouter | undefined;

export function setActiveRouter(router: VueRouter) {
  activeRouter = router;
}

function getActiveRouter() {
  if (!activeRouter) {
    throw failure('router must be set');
  }

  return activeRouter;
}

function pushRoute(location: RawLocation) {
  return new Promise<void>((resolve, reject) => {
    getActiveRouter().push(location, resolve, reject);
  });
}

export async function navigateToPredicateTree(focusedNodeId = '') {
  await pushRoute({ name: 'predicate-tree', params: { focusedNodeId } });
}
