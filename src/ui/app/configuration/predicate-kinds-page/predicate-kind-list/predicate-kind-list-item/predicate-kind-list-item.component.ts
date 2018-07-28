import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ActionsSubject } from '@ngrx/store';
import { AddArrayControlAction, RemoveArrayControlAction } from 'ngrx-forms';

import {
  CancelEditingPredicateKindListItemAction,
  DeletePredicateKindAction,
  EditPredicateKindListItemAction,
  SaveEditedPredicateKindListItemAction,
} from './predicate-kind-list-item.actions';
import { PredicatePropertyDescriptorFormValue } from './predicate-kind-list-item.dto';
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

  get propertyDescriptorControls() {
    return this.state.formState.controls.propertyDescriptors.controls;
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

    this.actionsSubject.next(new SaveEditedPredicateKindListItemAction(this.state.predicateKindId, this.state.formState.value));
  }

  addPropertyDescriptor() {
    this.actionsSubject.next(
      new AddArrayControlAction<PredicatePropertyDescriptorFormValue>(
        this.state.formState.controls.propertyDescriptors.id,
        {
          name: '',
          description: '',
          isRequired: true,
          valueType: 'string',
        },
      )
    );
  }

  removePropertyDescriptor(index: number) {
    this.actionsSubject.next(
      new RemoveArrayControlAction(
        this.state.formState.controls.propertyDescriptors.id,
        index,
      )
    );
  }

  trackByIndex(idx: number) {
    return idx;
  }
}
