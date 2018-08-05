import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ActionsSubject } from '@ngrx/store';

import { SelectPredicateNodeAction } from '../predicate-node';
import { PredicateNodeDetailsState } from './predicate-node-details.state';

@Component({
  selector: 'sim-predicate-node-details',
  templateUrl: './predicate-node-details.component.html',
  styleUrls: ['./predicate-node-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PredicateNodeDetailsComponent {
  @Input() state: PredicateNodeDetailsState;

  constructor(private actionsSubject: ActionsSubject) {}

  selectChildNode(childNodeId: string) {
    this.actionsSubject.next(new SelectPredicateNodeAction(childNodeId));
  }

  trackByKey(_: number, { key }: { key: string }) {
    return key;
  }
}
