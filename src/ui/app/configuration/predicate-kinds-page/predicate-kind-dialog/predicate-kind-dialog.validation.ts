import { setValue, updateArray, updateGroup, validate } from 'ngrx-forms';
import { required } from 'ngrx-forms/validation';

import { PredicateKindDialogFormValue, PredicateKindParameterFormValue } from './predicate-kind-dialog.dto';

export const validatePredicateKindParameter = updateGroup<PredicateKindParameterFormValue>({
  name: validate(required),
  description: validate(required),
  defaultValue: (defaultValue, parameter) => {
    if (parameter.value.valueType === 'string' && typeof defaultValue.value !== 'string') {
      defaultValue = setValue(defaultValue, '');
    }

    if (parameter.value.valueType === 'number' && typeof defaultValue.value !== 'number') {
      defaultValue = setValue(defaultValue, 0);
    }

    if (parameter.value.valueType === 'boolean' && typeof defaultValue.value !== 'boolean') {
      defaultValue = setValue(defaultValue, false);
    }

    return defaultValue;
  },
});

// TODO: validate distinct names of parameters
export const validatePredicateKindDialog = updateGroup<PredicateKindDialogFormValue>({
  name: validate(required),
  description: validate(required),
  evalFunctionBody: validate(required),
  parameters: updateArray(validatePredicateKindParameter),
});
