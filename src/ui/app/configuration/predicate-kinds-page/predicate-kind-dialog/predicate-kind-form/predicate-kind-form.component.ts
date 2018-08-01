import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ActionsSubject } from '@ngrx/store';
import { AddArrayControlAction, FormGroupState, RemoveArrayControlAction } from 'ngrx-forms';

import { PredicateKindDialogFormValue, PredicateKindParameterFormValue } from '../predicate-kind-dialog.dto';

@Component({
  selector: 'sim-predicate-kind-form',
  templateUrl: './predicate-kind-form.component.html',
  styleUrls: ['./predicate-kind-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PredicateKindFormComponent {
  @Input() formState: FormGroupState<PredicateKindDialogFormValue>;

  constructor(private actionsSubject: ActionsSubject) { }

  get parameterControls() {
    return this.formState.controls.parameters.controls;
  }

  addParameter() {
    this.actionsSubject.next(
      new AddArrayControlAction<PredicateKindParameterFormValue>(
        this.formState.controls.parameters.id,
        {
          name: '',
          description: '',
          isRequired: true,
          valueType: 'string',
          defaultValue: '',
        },
      )
    );
  }

  removeParameter(index: number) {
    this.actionsSubject.next(
      new RemoveArrayControlAction(this.formState.controls.parameters.id, index),
    );
  }

  trackByIndex(idx: number) {
    return idx;
  }
}
