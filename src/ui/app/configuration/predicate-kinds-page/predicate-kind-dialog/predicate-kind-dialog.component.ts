import { ChangeDetectionStrategy, Component, Input, OnDestroy } from '@angular/core';
import { ActionsSubject } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { delay, filter, map } from 'rxjs/operators';

import {
  CancelPredicateKindDialogAction,
  PredicateKindDialogClosedAction,
  PredicateKindDialogSubmitSuccessfulAction,
  SubmitPredicateKindDialogAction,
} from './predicate-kind-dialog.actions';
import { PredicateKindDialogState } from './predicate-kind-dialog.state';

@Component({
  selector: 'sim-predicate-kind-dialog',
  templateUrl: './predicate-kind-dialog.component.html',
  styleUrls: ['./predicate-kind-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PredicateKindDialogComponent implements OnDestroy {
  @Input() state: PredicateKindDialogState;

  private subscriptions: Subscription[] = [];

  constructor(private actionsSubject: ActionsSubject) {
    // this signals the end of the fade out animation of the dialog which
    // allows the state to set the properties required to ensure all
    // animations play properly
    this.subscriptions.push(
      actionsSubject.pipe(
        filter(a => a.type === PredicateKindDialogSubmitSuccessfulAction.TYPE || a.type === CancelPredicateKindDialogAction.TYPE),
        map(() => new PredicateKindDialogClosedAction()),
        delay(200),
      ).subscribe(actionsSubject)
    );
  }

  cancelDialog() {
    this.actionsSubject.next(new CancelPredicateKindDialogAction());
  }

  submitDialog() {
    if (this.state.formState.isInvalid) {
      return;
    }

    this.actionsSubject.next(new SubmitPredicateKindDialogAction(this.state.formState.value, this.state.predicateKindId));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
}
