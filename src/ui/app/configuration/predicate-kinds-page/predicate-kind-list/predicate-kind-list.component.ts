import { ChangeDetectionStrategy, Component, Input, OnDestroy } from '@angular/core';
import { ActionsSubject } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { delay, filter, map } from 'rxjs/operators';

import { PredicateKindListItemState } from './predicate-kind-list-item';
import {
  CancelNewPredicateKindDialogAction,
  NewPredicateKindDialogClosedAction,
  OpenNewPredicateKindDialogAction,
  SubmitNewPredicateKindDialogAction,
  SubmitNewPredicateKindDialogSuccessfulAction,
} from './predicate-kind-list.actions';
import { PredicateKindListState } from './predicate-kind-list.state';

@Component({
  selector: 'sim-predicate-kind-list',
  templateUrl: './predicate-kind-list.component.html',
  styleUrls: ['./predicate-kind-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PredicateKindListComponent implements OnDestroy {
  @Input() state: PredicateKindListState;

  private subscriptions: Subscription[] = [];

  constructor(private actionsSubject: ActionsSubject) {
    // this signals the end of the fade out animation of the dialog which
    // allows the state to set the properties required to ensure all
    // animations play properly
    this.subscriptions.push(
      actionsSubject.pipe(
        filter(a => a.type === SubmitNewPredicateKindDialogSuccessfulAction.TYPE || a.type === CancelNewPredicateKindDialogAction.TYPE),
        map(() => new NewPredicateKindDialogClosedAction()),
        delay(200),
      ).subscribe(actionsSubject)
    );
  }

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

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
}
