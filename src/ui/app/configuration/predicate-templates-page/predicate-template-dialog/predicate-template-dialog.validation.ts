import { setValue, updateArray, updateGroup, validate } from 'ngrx-forms';
import { required } from 'ngrx-forms/validation';

import { PredicateTemplateDialogFormValue, PredicateTemplateParameterFormValue } from './predicate-template-dialog.dto';

export const validatePredicateTemplateParameter = updateGroup<PredicateTemplateParameterFormValue>({
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
export const validatePredicateTemplateDialog = updateGroup<PredicateTemplateDialogFormValue>({
  name: validate(required),
  description: validate(required),
  evalFunctionBody: validate(required),
  parameters: updateArray(validatePredicateTemplateParameter),
});
