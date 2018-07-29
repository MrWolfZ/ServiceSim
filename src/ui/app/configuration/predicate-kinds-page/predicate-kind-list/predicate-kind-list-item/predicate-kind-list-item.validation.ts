import { updateArray, updateGroup, validate } from 'ngrx-forms';
import { required } from 'ngrx-forms/validation';

import { PredicateKindListItemFormValue } from './predicate-kind-list-item.dto';
import { validatePredicateKindParameter } from './predicate-kind-parameter/predicate-kind-parameter.validation';

// TODO: validate distinct names of parameters
export const validatePredicateKindListItem = updateGroup<PredicateKindListItemFormValue>({
  name: validate(required),
  description: validate(required),
  evalFunctionBody: validate(required),
  parameters: updateArray(validatePredicateKindParameter),
});
