import { updateArray, updateGroup, validate } from 'pure-forms';
import { required } from 'pure-forms/validation';
import { validateParameterForm } from '../parameter/parameter.validation';
import { PredicateTemplateFormValue } from './predicate-template.types';

export const validatePredicateTemplateForm = updateGroup<PredicateTemplateFormValue>({
  name: validate(required),
  description: validate(required),
  evalFunctionBody: validate(required),
  parameters: updateArray(validateParameterForm),
});
