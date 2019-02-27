import { Observable } from 'rxjs';
import { publishReplay, refCount, startWith } from 'rxjs/operators';
import { createObservable } from 'src/util/observable';
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

export async function navigateToPredicateTemplates() {
  await pushRoute({ name: 'predicate-templates' });
}

export async function navigateToPredicateTemplateDetails(templateId: string) {
  await pushRoute({ name: 'predicate-template', params: { id: templateId } });
}

export const routeParams$: Observable<Dictionary<string>> =
  createObservable<Dictionary<string>>(obs => {
    obs.next(getActiveRouter().currentRoute.params);

    const unsub = getActiveRouter().afterEach(to => {
      obs.next(to.params);
    });

    return unsub;
  }).pipe(
    startWith({}),
    publishReplay(1),
    refCount(),
  );
