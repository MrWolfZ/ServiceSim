import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ActionsSubject } from '@ngrx/store';

import { SelectPredicateNodeAction } from '../predicate-node';
import { ChildNodeState, PredicateNodeDetailsState } from './predicate-node-details.state';

@Component({
  selector: 'sim-predicate-node-details',
  templateUrl: './predicate-node-details.component.html',
  styleUrls: ['./predicate-node-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PredicateNodeDetailsComponent {
  @Input() state: PredicateNodeDetailsState | undefined;

  constructor(private actionsSubject: ActionsSubject) {}

  selectChildNode(childNodeId: string) {
    this.actionsSubject.next(new SelectPredicateNodeAction(childNodeId));
  }

  trackByIndex(idx: number) {
    return idx;
  }

  trackByNodeId(_: number, childNode: ChildNodeState) {
    return childNode.nodeId;
  }
}
