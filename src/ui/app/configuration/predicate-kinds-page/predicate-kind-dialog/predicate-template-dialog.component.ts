import { ChangeDetectionStrategy, Component, Input, OnDestroy } from '@angular/core';
import { ActionsSubject } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { delay, filter, map } from 'rxjs/operators';

import {
  CancelPredicateTemplateDialogAction,
  PredicateTemplateDialogClosedAction,
  PredicateTemplateDialogSubmitSuccessfulAction,
  SubmitPredicateTemplateDialogAction,
} from './predicate-template-dialog.actions';
import { PredicateTemplateDialogState } from './predicate-template-dialog.state';

@Component({
  selector: 'sim-predicate-template-dialog',
  templateUrl: './predicate-template-dialog.component.html',
  styleUrls: ['./predicate-template-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PredicateTemplateDialogComponent implements OnDestroy {
  @Input() state: PredicateTemplateDialogState;

  private subscriptions: Subscription[] = [];

  constructor(private actionsSubject: ActionsSubject) {
    // this signals the end of the fade out animation of the dialog which
    // allows the state to set the properties required to ensure all
    // animations play properly
    this.subscriptions.push(
      actionsSubject.pipe(
        filter(a => a.type === PredicateTemplateDialogSubmitSuccessfulAction.TYPE || a.type === CancelPredicateTemplateDialogAction.TYPE),
        map(() => new PredicateTemplateDialogClosedAction()),
        delay(200),
      ).subscribe(actionsSubject)
    );
  }

  cancelDialog() {
    this.actionsSubject.next(new CancelPredicateTemplateDialogAction());
  }

  submitDialog() {
    if (this.state.formState.isInvalid) {
      return;
    }

    this.actionsSubject.next(new SubmitPredicateTemplateDialogAction(this.state.formState.value, this.state.templateId));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
}
