import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ActionsSubject } from '@ngrx/store';

import { deepEquals } from 'app/infrastructure';
import {
  AddPredicateKindParameterAction,
  CancelEditingPredicateKindListItemAction,
  DeletePredicateKindAction,
  EditPredicateKindListItemAction,
  RemovePredicateKindParameterAction,
  SaveEditedPredicateKindListItemAction,
} from './predicate-kind-list-item.actions';
import { PredicateKindListItemFormValue } from './predicate-kind-list-item.dto';
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

  get parameterControls() {
    return this.state.formState.controls.parameters.controls;
  }

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

    const hasChanged = !deepEquals<PredicateKindListItemFormValue>(this.state.formState.value, {
      name: this.state.name,
      description: this.state.description,
      evalFunctionBody: this.state.evalFunctionBody,
      parameters: this.state.parameters.map(p => ({
        name: p.name,
        description: p.description,
        isRequired: p.isRequired,
        valueType: p.valueType,
        defaultValue: p.defaultValue,
      })),
    });

    if (!hasChanged) {
      this.actionsSubject.next(new CancelEditingPredicateKindListItemAction(this.state.predicateKindId));
      return;
    }

    this.actionsSubject.next(new SaveEditedPredicateKindListItemAction(this.state.predicateKindId, this.state.formState.value));
  }

  addParameter() {
    this.actionsSubject.next(new AddPredicateKindParameterAction(this.state.predicateKindId));
  }

  removeParameter(index: number) {
    this.actionsSubject.next(new RemovePredicateKindParameterAction(this.state.predicateKindId, index));
  }

  trackByIndex(idx: number) {
    return idx;
  }
}
