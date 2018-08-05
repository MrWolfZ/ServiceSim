import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ActionsSubject } from '@ngrx/store';

import { SelectPredicateNodeAction, TogglePredicateNodeExpansionAction } from './predicate-node.actions';
import { PredicateNodeState } from './predicate-node.state';

@Component({
  selector: 'sim-predicate-node',
  templateUrl: './predicate-node.component.html',
  styleUrls: ['./predicate-node.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PredicateNodeComponent {
  @Input() state: PredicateNodeState;

  constructor(
    private actionsSubject: ActionsSubject,
  ) { }

  toggleExpansion() {
    if (this.state.childNodes.length === 0) {
      return;
    }

    this.actionsSubject.next(new TogglePredicateNodeExpansionAction(this.state.node.nodeId));
  }

  selectNode() {
    if (this.state.isSelected) {
      return;
    }

    this.actionsSubject.next(new SelectPredicateNodeAction(this.state.node.nodeId));
  }

  trackByNodeId(_: number, state: PredicateNodeState) {
    return state.node.nodeId;
  }

  trackByKey(_: number, { key }: { key: string }) {
    return key;
  }
}
