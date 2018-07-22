import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { FormControlState } from 'ngrx-forms';

@Component({
  selector: 'sim-form-control-errors',
  template: `
  <sim-expansion-container class="form-control-errors" [isCollapsed]="!errorsAreShown">
    <ng-content></ng-content>
  </sim-expansion-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class FormControlErrorsComponent {
  @Input() formState: FormControlState<any>;

  get errorsAreShown() {
    return this.formState.isInvalid && (this.formState.isSubmitted || this.formState.isTouched);
  }
}
