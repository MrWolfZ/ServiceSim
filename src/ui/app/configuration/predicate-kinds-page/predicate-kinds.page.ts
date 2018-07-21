import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { PredicateKindsPageState, RootState } from './predicate-kinds.state';

@Component({
  templateUrl: './predicate-kinds.page.html',
  styleUrls: ['./predicate-kinds.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PredicateKindsPage {
  @HostBinding('class.page') page = true;

  state$: Observable<PredicateKindsPageState>;

  constructor(store: Store<RootState>) {
    this.state$ = store.select(s => s.predicateKinds);
  }
}
