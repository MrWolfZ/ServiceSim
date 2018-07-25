import { createFormGroupState, FormGroupState } from 'ngrx-forms';

import { PredicateKindListItemDto, PredicateKindListItemFormValue } from './predicate-kind-list-item.dto';

export interface PredicateKindListItemState extends PredicateKindListItemDto {
  isEditing: boolean;
  isChanged: boolean;
  isSaving: boolean;
  isNewItem: boolean;
  isDeleting: boolean;
  isReadOnly: boolean;
  formState: FormGroupState<PredicateKindListItemFormValue>;
}

export const PREDICATE_KIND_LIST_ITEM_FORM_STATE_ID_PREFIX = 'configuration/predicate-kinds-page/predicate-kind-list/predicate-kind-list-item/FORM_';

export const INITIAL_PREDICATE_KIND_LIST_ITEM_FORM_STATE = createFormGroupState<PredicateKindListItemFormValue>(
  PREDICATE_KIND_LIST_ITEM_FORM_STATE_ID_PREFIX,
  {
    name: '',
    description: '',
    evalFunctionBody: '',
    propertyDescriptors: [],
  },
);

export const INITIAL_PREDICATE_KIND_LIST_ITEM_STATE: PredicateKindListItemState = {
  predicateKindId: '',
  name: '',
  description: '',
  evalFunctionBody: '',
  propertyDescriptors: [],
  isEditing: false,
  isChanged: false,
  isSaving: false,
  isNewItem: false,
  isDeleting: false,
  isReadOnly: true,
  formState: INITIAL_PREDICATE_KIND_LIST_ITEM_FORM_STATE,
};
