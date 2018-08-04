import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { ActionsSubject, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { OpenPredicateTemplateDialogAction } from './predicate-template-dialog';
import { PredicateTemplateTileState } from './predicate-template-tile';
import { PredicateTemplatesPageState, RootState } from './predicate-templates.state';

@Component({
  templateUrl: './predicate-templates.page.html',
  styleUrls: ['./predicate-templates.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PredicateTemplatesPage {
  @HostBinding('class.page') page = true;

  state$: Observable<PredicateTemplatesPageState>;

  constructor(store: Store<RootState>, private actionsSubject: ActionsSubject) {
    this.state$ = store.select(s => s.predicateTemplatesPage);
  }

  openNewItemDialog() {
    this.actionsSubject.next(new OpenPredicateTemplateDialogAction());
  }

  trackById(_: number, item: PredicateTemplateTileState) {
    return item.templateId;
  }
}
