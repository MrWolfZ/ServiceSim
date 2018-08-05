import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ActionsSubject } from '@ngrx/store';

import { SelectPredicateNodeAction } from '../predicate-node';
import { OpenPredicateNodeEditDialogAction } from '../predicate-node-edit-dialog';
import { PredicateNodeDetailsState } from './predicate-node-details.state';

@Component({
  selector: 'sim-predicate-node-details',
  templateUrl: './predicate-node-details.component.html',
  styleUrls: ['./predicate-node-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PredicateNodeDetailsComponent {
  @Input() state: PredicateNodeDetailsState;

  constructor(private actionsSubject: ActionsSubject) { }

  selectChildNode(childNodeId: string) {
    this.actionsSubject.next(new SelectPredicateNodeAction(childNodeId));
  }

  startEdit() {
    this.actionsSubject.next(new OpenPredicateNodeEditDialogAction(this.state.node));
  }

  trackByKey(_: number, { key }: { key: string }) {
    return key;
  }
}
