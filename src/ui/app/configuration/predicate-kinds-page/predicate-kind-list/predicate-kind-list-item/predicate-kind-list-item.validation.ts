import { updateArray, updateGroup, validate } from 'ngrx-forms';
import { required } from 'ngrx-forms/validation';

import { PredicateKindListItemFormValue, PredicateKindParameterFormValue } from './predicate-kind-list-item.dto';

export const validateParameters = updateGroup<PredicateKindParameterFormValue>({
  name: validate(required),
  description: validate(required),
});

export const validatePredicateKindListItem = updateGroup<PredicateKindListItemFormValue>({
  name: validate(required),
  description: validate(required),
  evalFunctionBody: validate(required),
  parameters: updateArray(validateParameters),
});
