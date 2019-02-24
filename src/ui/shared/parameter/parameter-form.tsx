import { Action, FormControlState, FormGroupState, setValue, updateGroup, validate } from 'pure-forms';
import { required } from 'pure-forms/validation';
import { Parameter } from 'src/domain/parameter';
import { pure } from 'src/ui/infrastructure/tsx';
import { FormField } from '../form-components/form-field';
import { NumberInput } from '../form-components/number-input';
import { RadioInput } from '../form-components/radio-input';
import { Select } from '../form-components/select';
import { TextInput } from '../form-components/text-input';

export type ParameterFormValue = Parameter;

export interface ParameterFormProps {
  formState: FormGroupState<ParameterFormValue>;
  className?: string;
  onAction: (action: Action) => any;
  onRemove: () => any;
}

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

export const ParameterForm = pure(({ formState, className, onAction, onRemove }: ParameterFormProps) => {
  return (
    <div class={className}>

      <FormField
        label='Parameter Name'
        controlState={formState.controls.name}
        errorMessages={{ required: 'Please enter a name' }}
      >
        <TextInput controlState={formState.controls.name} onAction={onAction} />
      </FormField>

      <FormField
        label='Description'
        controlState={formState.controls.description}
        errorMessages={{ required: 'Please enter a description' }}
      >
        <TextInput controlState={formState.controls.description} onAction={onAction} />
      </FormField>

      <div class='columns'>

        <div class='column is-narrow'>

          <FormField label='Is Required?' controlState={formState.controls.isRequired}>
            <RadioInput
              options={{ Yes: true, No: false }}
              controlState={formState.controls.isRequired}
              onAction={onAction}
            />
          </FormField>

        </div>

        <div class='column is-narrow'>

          <FormField label='Value Type' controlState={formState.controls.valueType}>
            <Select
              options={{ string: 'string', boolean: 'boolean', number: 'number' }}
              controlState={formState.controls.valueType}
              onAction={onAction}
            />
          </FormField>

        </div>

        <div class='column'>

          <FormField label='Default Value' controlState={formState.controls.defaultValue}>

            {formState.value.valueType === 'string' &&
              <TextInput
                controlState={formState.controls.defaultValue as FormControlState<string>}
                onAction={onAction}
              />
            }

            {formState.value.valueType === 'number' &&
              <NumberInput
                controlState={formState.controls.defaultValue as FormControlState<number>}
                onAction={onAction}
              />
            }

            {formState.value.valueType === 'boolean' &&
              <RadioInput
                options={{ True: true, False: false }}
                controlState={formState.controls.defaultValue}
                onAction={onAction}
              />
            }

          </FormField>

        </div>

      </div>

      <button
        class='button is-danger'
        type='button'
        onClick={onRemove}
        disabled={formState.isDisabled}
      >
        <span>Remove</span>
        <span class='icon is-small'>
          <fa-icon icon='times' />
        </span>
      </button>

    </div>
  );
});
