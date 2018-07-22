import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ActionsSubject } from '@ngrx/store';

import { PredicateKindListItemState } from './predicate-kind-list-item';
import { CancelNewPredicateKindDialogAction, OpenNewPredicateKindDialogAction, SubmitNewPredicateKindDialogAction } from './predicate-kind-list.actions';
import { PredicateKindListState } from './predicate-kind-list.state';

@Component({
  selector: 'sim-predicate-kind-list',
  templateUrl: './predicate-kind-list.component.html',
  styleUrls: ['./predicate-kind-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PredicateKindListComponent {
  @Input() state: PredicateKindListState;

  constructor(private actionsSubject: ActionsSubject) { }

  openNewItemDialog() {
    this.actionsSubject.next(new OpenNewPredicateKindDialogAction());
  }

  cancelNewItemDialog() {
    this.actionsSubject.next(new CancelNewPredicateKindDialogAction());
  }

  submitNewItemDialog() {
    if (this.state.newItem.formState.isInvalid) {
      return;
    }

    this.actionsSubject.next(new SubmitNewPredicateKindDialogAction(this.state.newItem.formState.value));
  }

  trackById(_: number, item: PredicateKindListItemState) {
    return item.predicateKindId;
  }
}
