import { createFormGroupState, FormGroupState } from 'ngrx-forms';

import { PredicateKindListItemDto, PredicateKindListItemFormValue } from './predicate-kind-list-item.dto';

export interface PredicateKindListItemState extends PredicateKindListItemDto {
  isEditing: boolean;
  isNewItem: boolean;
  formState: FormGroupState<PredicateKindListItemFormValue>;
}

export const PREDICATE_KIND_LIST_ITEM_FORM_STATE_ID_PREFIX = 'configuration/predicate-kinds-page/predicate-kind-list/predicate-kind-list-item/FORM_';

export const INITIAL_PREDICATE_KIND_LIST_ITEM_FORM_STATE = createFormGroupState<PredicateKindListItemFormValue>(
  PREDICATE_KIND_LIST_ITEM_FORM_STATE_ID_PREFIX,
  {
    name: '',
    description: '',
    evalFunctionBody: '',
  },
);

export const INITIAL_PREDICATE_KIND_LIST_ITEM_STATE: PredicateKindListItemState = {
  predicateKindId: '',
  name: '',
  description: '',
  evalFunctionBody: '',
  isEditing: false,
  isNewItem: false,
  formState: INITIAL_PREDICATE_KIND_LIST_ITEM_FORM_STATE,
};
