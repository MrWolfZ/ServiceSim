import { FormControlState, FormGroupState, setValue, updateArray, updateGroup, validate } from 'ngrx-forms';
import { required } from 'ngrx-forms/validation';

import { ParameterFormValue, PredicateTemplateDialogFormValue } from './predicate-template-dialog.dto';

export const validatePredicateTemplateParameter = updateGroup<ParameterFormValue>({
  name: validate(required),
  description: validate(required),
  defaultValue: (defaultValue: FormControlState<any>, parameter: FormGroupState<ParameterFormValue>) => {
    if (parameter.value.valueType === 'string' && typeof defaultValue.value !== 'string') {
      defaultValue = setValue<string>(defaultValue, '');
    }

    if (parameter.value.valueType === 'number' && typeof defaultValue.value !== 'number') {
      defaultValue = setValue<number>(defaultValue, 0);
    }

    if (parameter.value.valueType === 'boolean' && typeof defaultValue.value !== 'boolean') {
      defaultValue = setValue<boolean>(defaultValue, false);
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
