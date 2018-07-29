import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroupState } from 'ngrx-forms';

import { PredicateKindParameterFormValue } from './predicate-kind-parameter.dto';
import { PredicateKindParameterState } from './predicate-kind-parameter.state';

@Component({
  selector: 'sim-predicate-kind-parameter',
  templateUrl: './predicate-kind-parameter.component.html',
  styleUrls: ['./predicate-kind-parameter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PredicateKindParameterComponent {
  @Input() state: PredicateKindParameterState;
  @Input() formState: FormGroupState<PredicateKindParameterFormValue>;

  @Output() deleteButtonClicked = new EventEmitter();

  removeParameter() {
    this.deleteButtonClicked.next();
  }
}
