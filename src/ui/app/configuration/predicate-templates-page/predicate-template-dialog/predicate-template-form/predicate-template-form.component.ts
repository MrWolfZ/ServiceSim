import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ActionsSubject } from '@ngrx/store';
import { AddArrayControlAction, FormGroupState, RemoveArrayControlAction } from 'ngrx-forms';

import { PredicateTemplateDialogFormValue, PredicateTemplateParameterFormValue } from '../predicate-template-dialog.dto';

@Component({
  selector: 'sim-predicate-template-form',
  templateUrl: './predicate-template-form.component.html',
  styleUrls: ['./predicate-template-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PredicateTemplateFormComponent {
  @Input() formState: FormGroupState<PredicateTemplateDialogFormValue>;

  constructor(private actionsSubject: ActionsSubject) { }

  get parameterControls() {
    return this.formState.controls.parameters.controls;
  }

  addParameter() {
    this.actionsSubject.next(
      new AddArrayControlAction<PredicateTemplateParameterFormValue>(
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
