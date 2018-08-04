import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { ActionsSubject } from '@ngrx/store';
import { first, map } from 'rxjs/operators';

import { HandleApiErrorAction } from 'app/infrastructure';

import { InitializePredicateTemplatesPageAction, LoadPredicateTemplatesPageDataAction } from './predicate-templates.actions';

@Injectable()
export class PredicateTemplatesPageInitializationGuard implements CanActivate {
  constructor(private actionsSubject: ActionsSubject) { }

  canActivate() {
    this.actionsSubject.next(new LoadPredicateTemplatesPageDataAction());
    return this.actionsSubject.pipe(
      first(a => a.type === InitializePredicateTemplatesPageAction.TYPE || a.type === HandleApiErrorAction.TYPE),
      map(a => a.type === InitializePredicateTemplatesPageAction.TYPE),
    );
  }
}
