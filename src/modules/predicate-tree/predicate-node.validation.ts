import { updateGroup, validate } from 'pure-forms';
import { minLength, required } from 'pure-forms/validation';
import { PredicateNodeFormValue } from './predicate-node.types';

export const validatePredicateNodeForm = updateGroup<PredicateNodeFormValue>({
  name: validate(required),
  description: validate(required),
  evalFunctionBody: validate(minLength(1)),
});
