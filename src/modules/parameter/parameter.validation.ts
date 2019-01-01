import { updateGroup, validate } from 'pure-forms';
import { required } from 'pure-forms/validation';
import { ParameterFormValue } from './parameter.types';

export const validateParameterForm = updateGroup<ParameterFormValue>({
  name: validate(required),
  description: validate(required),
});
