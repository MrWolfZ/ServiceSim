import { ChangeDetectionStrategy, Component, Input, OnDestroy } from '@angular/core';
import { ActionsSubject } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { delay, filter, map } from 'rxjs/operators';

import {
  CancelPredicateNodeEditDialogAction,
  PredicateNodeEditDialogClosedAction,
  PredicateNodeEditDialogSubmitSuccessfulAction,
  SubmitPredicateNodeEditDialogAction,
} from './predicate-node-edit-dialog.actions';
import { PredicateNodeEditDialogState } from './predicate-node-edit-dialog.state';

@Component({
  selector: 'sim-predicate-node-edit-dialog',
  templateUrl: './predicate-node-edit-dialog.component.html',
  styleUrls: ['./predicate-node-edit-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PredicateNodeEditDialogComponent implements OnDestroy {
  @Input() state: PredicateNodeEditDialogState;

  private subscriptions: Subscription[] = [];

  constructor(private actionsSubject: ActionsSubject) {
    // this signals the end of the fade out animation of the dialog which
    // allows the state to set the properties required to ensure all
    // animations play properly
    this.subscriptions.push(
      actionsSubject.pipe(
        filter(a => a.type === PredicateNodeEditDialogSubmitSuccessfulAction.TYPE || a.type === CancelPredicateNodeEditDialogAction.TYPE),
        map(() => new PredicateNodeEditDialogClosedAction()),
        delay(200),
      ).subscribe(actionsSubject)
    );
  }

  get parameterValuesControls() {
    return this.state.formState.controls.parameterValues.controls;
  }

  cancelDialog() {
    this.actionsSubject.next(new CancelPredicateNodeEditDialogAction());
  }

  submitDialog() {
    if (this.state.formState.isInvalid) {
      return;
    }

    this.actionsSubject.next(new SubmitPredicateNodeEditDialogAction(this.state.formState.value, this.state.node.nodeId));
  }

  trackByIndex(idx: number) {
    return idx;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
}
