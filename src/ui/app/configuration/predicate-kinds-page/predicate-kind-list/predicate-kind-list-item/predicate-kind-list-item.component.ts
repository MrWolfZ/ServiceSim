import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ActionsSubject } from '@ngrx/store';

import {
  CancelEditingPredicateKindListItemAction,
  DeletePredicateKindAction,
  EditPredicateKindListItemAction,
  SaveEditedPredicateKindListItemAction,
} from './predicate-kind-list-item.actions';
import { PredicateKindListItemState } from './predicate-kind-list-item.state';

@Component({
  selector: 'sim-predicate-kind-list-item',
  templateUrl: './predicate-kind-list-item.component.html',
  styleUrls: ['./predicate-kind-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PredicateKindListItemComponent {
  @Input() state: PredicateKindListItemState;

  constructor(private actionsSubject: ActionsSubject) { }

  delete() {
    this.actionsSubject.next(new DeletePredicateKindAction(this.state.predicateKindId));
  }

  startEdit() {
    this.actionsSubject.next(new EditPredicateKindListItemAction(this.state.predicateKindId));
  }

  cancelEdit() {
    this.actionsSubject.next(new CancelEditingPredicateKindListItemAction(this.state.predicateKindId));
  }

  submitEdit() {
    if (this.state.formState.isInvalid) {
      return;
    }

    this.actionsSubject.next(new SaveEditedPredicateKindListItemAction(this.state.predicateKindId, this.state.formState.value));
  }
}
