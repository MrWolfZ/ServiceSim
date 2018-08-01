import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { PredicateNodeState } from './predicate-node';
import { PredicateNodeDetailsState } from './predicate-node-details';
import { PredicateTreePageState, RootState } from './predicate-tree.state';

@Component({
  templateUrl: './predicate-tree.page.html',
  styleUrls: ['./predicate-tree.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PredicateTreePage {
  @HostBinding('class.page') page = true;

  state$: Observable<PredicateTreePageState>;
  selectedNode$: Observable<PredicateNodeDetailsState | undefined>;

  constructor(store: Store<RootState>) {
    this.state$ = store.pipe(select(s => s.predicateTree));
    this.selectedNode$ = this.state$.pipe(map(s => s.selectedNodeId ? s.nodeDetailsByNodeId[s.selectedNodeId] : undefined));
  }

  trackByNodeId(_: number, node: PredicateNodeState) {
    return node.nodeId;
  }
}
