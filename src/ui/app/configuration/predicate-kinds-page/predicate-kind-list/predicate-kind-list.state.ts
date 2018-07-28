import { createFormControlState, FormControlState } from 'ngrx-forms';

import { PredicateKindListItemState } from './predicate-kind-list-item';
import { PredicateKindListDto } from './predicate-kind-list.dto';

export interface PredicateKindListState extends PredicateKindListDto {
  items: PredicateKindListItemState[];
  filterControl: FormControlState<string>;
  newItem: PredicateKindListItemState;
  newItemDialogIsOpen: boolean;
  newItemDialogIsClosing: boolean;
  newItemIsSubmitting: boolean;
}

export const INITIAL_PREDICATE_KIND_LIST_STATE: PredicateKindListState = {
  items: undefined!,
  filterControl: createFormControlState('configuration/predicate-kinds-page/predicate-kind-list/FILTER_CONTROL', ''),
  newItem: undefined!,
  newItemDialogIsOpen: false,
  newItemDialogIsClosing: false,
  newItemIsSubmitting: false,
};
