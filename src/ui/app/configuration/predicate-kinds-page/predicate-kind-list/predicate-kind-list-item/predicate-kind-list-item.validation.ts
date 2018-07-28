import { updateArray, updateGroup, validate } from 'ngrx-forms';
import { required } from 'ngrx-forms/validation';

import { PredicateKindListItemFormValue, PredicatePropertyDescriptorFormValue } from './predicate-kind-list-item.dto';

export const validatePropertyDescriptor = updateGroup<PredicatePropertyDescriptorFormValue>({
  name: validate(required),
  description: validate(required),
});

export const validatePredicateKindListItem = updateGroup<PredicateKindListItemFormValue>({
  name: validate(required),
  description: validate(required),
  evalFunctionBody: validate(required),
  propertyDescriptors: updateArray(validatePropertyDescriptor),
});
