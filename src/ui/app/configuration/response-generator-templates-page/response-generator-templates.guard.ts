import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { ActionsSubject } from '@ngrx/store';
import { first, map } from 'rxjs/operators';

import { HandleApiErrorAction } from 'app/infrastructure';

import { InitializeResponseGeneratorTemplatesPageAction, LoadResponseGeneratorTemplatesPageDataAction } from './response-generator-templates.actions';

@Injectable()
export class ResponseGeneratorTemplatesPageInitializationGuard implements CanActivate {
  constructor(private actionsSubject: ActionsSubject) { }

  canActivate() {
    this.actionsSubject.next(new LoadResponseGeneratorTemplatesPageDataAction());
    return this.actionsSubject.pipe(
      first(a => a.type === InitializeResponseGeneratorTemplatesPageAction.TYPE || a.type === HandleApiErrorAction.TYPE),
      map(a => a.type === InitializeResponseGeneratorTemplatesPageAction.TYPE),
    );
  }
}
