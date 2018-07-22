import { updateGroup, validate } from 'ngrx-forms';
import { required } from 'ngrx-forms/validation';

import { PredicateKindListItemFormValue } from './predicate-kind-list-item.dto';

export const validatePredicateKindListItem = updateGroup<PredicateKindListItemFormValue>({
  name: validate(required),
  description: validate(required),
  evalFunctionBody: validate(required),
});
