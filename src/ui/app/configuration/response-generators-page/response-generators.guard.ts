import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { ActionsSubject } from '@ngrx/store';
import { first, map } from 'rxjs/operators';

import { HandleApiErrorAction } from 'app/infrastructure';

import { InitializeResponseGeneratorsPageAction, LoadResponseGeneratorsPageDataAction } from './response-generators.actions';

@Injectable()
export class ResponseGeneratorsPageInitializationGuard implements CanActivate {
  constructor(private actionsSubject: ActionsSubject) { }

  canActivate() {
    this.actionsSubject.next(new LoadResponseGeneratorsPageDataAction());
    return this.actionsSubject.pipe(
      first(a => a.type === InitializeResponseGeneratorsPageAction.TYPE || a.type === HandleApiErrorAction.TYPE),
      map(a => a.type === InitializeResponseGeneratorsPageAction.TYPE),
    );
  }
}
