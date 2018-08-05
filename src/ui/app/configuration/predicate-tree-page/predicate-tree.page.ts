import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { PredicateNodeState } from './predicate-node';
import { PredicateTreePageState, RootState } from './predicate-tree.state';

@Component({
  templateUrl: './predicate-tree.page.html',
  styleUrls: ['./predicate-tree.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PredicateTreePage {
  @HostBinding('class.page') page = true;

  state$: Observable<PredicateTreePageState>;

  constructor(store: Store<RootState>) {
    this.state$ = store.pipe(select(s => s.predicateTree));
  }

  trackByNodeId(_: number, state: PredicateNodeState) {
    return state.node.nodeId;
  }
}
