import { FormControlState, FormGroupState, setValue, updateGroup, validate } from 'pure-forms';
import { required } from 'pure-forms/validation';
import { ParameterFormValue } from './parameter.types';

export const validateParameterForm = updateGroup<ParameterFormValue>({
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
