import { ActionsSubject } from '@ngrx/store';
import { merge } from 'rxjs';
import { first, map } from 'rxjs/operators';

import { HandleApiErrorAction } from '../error-page/error.actions';

export function handleInitializationAndApiError(actionsSubject: ActionsSubject, actionType: string) {
  return merge(
    actionsSubject.pipe(
      first(a => a.type === actionType),
      map(() => true),
    ),
    actionsSubject.pipe(
      first(a => a.type === HandleApiErrorAction.TYPE),
      map(() => false),
    )
  );
}
