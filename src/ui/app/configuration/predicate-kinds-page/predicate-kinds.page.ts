import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { ActionsSubject, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { OpenPredicateKindDialogAction } from './predicate-kind-dialog';
import { PredicateKindTileState } from './predicate-kind-tile';
import { PredicateKindsPageState, RootState } from './predicate-kinds.state';

@Component({
  templateUrl: './predicate-kinds.page.html',
  styleUrls: ['./predicate-kinds.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PredicateKindsPage {
  @HostBinding('class.page') page = true;

  state$: Observable<PredicateKindsPageState>;

  constructor(store: Store<RootState>, private actionsSubject: ActionsSubject) {
    this.state$ = store.select(s => s.predicateKinds);
  }

  openNewItemDialog() {
    this.actionsSubject.next(new OpenPredicateKindDialogAction());
  }

  trackById(_: number, item: PredicateKindTileState) {
    return item.predicateKindId;
  }
}
