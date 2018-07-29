import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { ActionsSubject } from '@ngrx/store';
import { first, map } from 'rxjs/operators';

import { HandleApiErrorAction } from 'app/infrastructure';

import { InitializePredicateKindsPageAction, LoadPredicateKindsPageDataAction } from './predicate-kinds.actions';

@Injectable()
export class PredicateKindsPageInitializationGuard implements CanActivate {
  constructor(private actionsSubject: ActionsSubject) { }

  canActivate() {
    this.actionsSubject.next(new LoadPredicateKindsPageDataAction());
    return this.actionsSubject.pipe(
      first(a => a.type === InitializePredicateKindsPageAction.TYPE || a.type === HandleApiErrorAction.TYPE),
      map(a => a.type === InitializePredicateKindsPageAction.TYPE),
    );
  }
}
