<script lang="tsx">
import { Action, FormControlState, FormGroupState, setValue, updateGroup, validate } from 'pure-forms';
import { required } from 'pure-forms/validation';
import { Component, Prop } from 'vue-property-decorator';
import { Emit, FormField, NumberInput, RadioInput, Select, TextInput, TsxComponent } from '../../ui-infrastructure';
import { ParameterFormValue } from './parameter.types';

export interface ParameterFormProps {
  formState: FormGroupState<ParameterFormValue>;
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

@Component({})
export default class ParameterForm extends TsxComponent<ParameterFormProps> implements ParameterFormProps {
  @Prop() formState: FormGroupState<ParameterFormValue>;

  @Emit()
  onAction(_: Action) { }

  @Emit()
  onRemove() { }

  render() {
    return (
      <div>

        <FormField
          label='Parameter Name'
          controlState={this.formState.controls.name}
          errorMessages={{ required: 'Please enter a name' }}
        >
          <TextInput controlState={this.formState.controls.name} onAction={a => this.onAction(a)} />
        </FormField>

        <FormField
          label='Description'
          controlState={this.formState.controls.description}
          errorMessages={{ required: 'Please enter a description' }}
        >
          <TextInput controlState={this.formState.controls.description} onAction={a => this.onAction(a)} />
        </FormField>

        <div class='columns'>

          <div class='column is-narrow'>

            <FormField label='Is Required?' controlState={this.formState.controls.isRequired}>
              <RadioInput
                options={{ Yes: true, No: false }}
                controlState={this.formState.controls.isRequired}
                onAction={a => this.onAction(a)}
              />
            </FormField>

          </div>

          <div class='column is-narrow'>

            <FormField label='Value Type' controlState={this.formState.controls.valueType}>
              <Select
                options={{ string: 'string', boolean: 'boolean', number: 'number' }}
                controlState={this.formState.controls.valueType}
                onAction={a => this.onAction(a)}
              />
            </FormField>

          </div>

          <div class='column'>

            <FormField label='Default Value' controlState={this.formState.controls.defaultValue}>

              {this.formState.value.valueType === 'string' &&
                <TextInput
                  controlState={this.formState.controls.defaultValue as FormControlState<string>}
                  onAction={a => this.onAction(a)}
                />
              }

              {this.formState.value.valueType === 'number' &&
                <NumberInput
                  controlState={this.formState.controls.defaultValue as FormControlState<number>}
                  onAction={a => this.onAction(a)}
                />
              }

              {this.formState.value.valueType === 'boolean' &&
                <RadioInput
                  options={{ True: true, False: false }}
                  controlState={this.formState.controls.defaultValue}
                  onAction={a => this.onAction(a)}
                />
              }

            </FormField>

          </div>

        </div>

        <button
          class='button is-danger'
          type='button'
          onClick={() => this.onRemove()}
        >
          <span>Remove</span>
          <span class='icon is-small'>
            <fa-icon icon='times' />
          </span>
        </button>

      </div>
    );
  }
}
</script>

<style scoped lang="scss">
</style>
