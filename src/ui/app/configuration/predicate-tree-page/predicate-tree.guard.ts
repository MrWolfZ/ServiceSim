import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { ActionsSubject } from '@ngrx/store';
import { first, map } from 'rxjs/operators';

import { HandleApiErrorAction } from 'app/infrastructure';

import { InitializePredicateTreePageAction, LoadPredicateTreePageDataAction } from './predicate-tree.actions';

@Injectable()
export class PredicateTreePageInitializationGuard implements CanActivate {
  constructor(private actionsSubject: ActionsSubject) { }

  canActivate() {
    this.actionsSubject.next(new LoadPredicateTreePageDataAction());
    return this.actionsSubject.pipe(
      first(a => a.type === InitializePredicateTreePageAction.TYPE || a.type === HandleApiErrorAction.TYPE),
      map(a => a.type === InitializePredicateTreePageAction.TYPE),
    );
  }
}
