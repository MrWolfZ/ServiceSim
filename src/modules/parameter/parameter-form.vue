<script lang="tsx">
import { Action, FormGroupState, SetValueAction } from 'pure-forms';
import { Component, Prop } from 'vue-property-decorator';
import { BooleanInput, Emit, FormField, Input, NumberInput, TextInput, TsxComponent } from '../../ui-infrastructure';
import { ParameterFormValue } from './parameter.types';

export interface ParameterFormProps {
  formState: FormGroupState<ParameterFormValue>;
  onAction: (action: Action) => any;
  onRemove: () => any;
}

let instanceCount = 0;

@Component({
  components: {},
})
export default class ParameterForm extends TsxComponent<ParameterFormProps> implements ParameterFormProps {
  @Prop() formState: FormGroupState<ParameterFormValue>;

  private instanceCount = instanceCount++;

  @Emit()
  onAction(_: Action) { }

  @Emit()
  onRemove() { }

  private updateValueType(newValueType: ParameterFormValue['valueType']) {
    const newDefaultValue = (() => {
      switch (newValueType) {
        case 'string':
        default:
          return '';

        case 'number':
          return 0;

        case 'boolean':
          return false;
      }
    })();

    this.onAction(new SetValueAction(this.formState.controls.valueType.id, newValueType));
    this.onAction(new SetValueAction(this.formState.controls.defaultValue.id, newDefaultValue));
  }

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
            <div class='field'>
              <label class='label'>Is Required?</label>
              <div class='control radio-control'>
                <BooleanInput
                  type='radio'
                  id={`parameterForm.isRequired.${this.instanceCount}.yes`}
                  class='is-checkradio is-rtl is-white'
                  value={true}
                  checked={this.formState.value.isRequired}
                  onInput={value => this.onAction(new SetValueAction(this.formState.controls.isRequired.id, value))}
                />
                <label for={`parameterForm.isRequired.${this.instanceCount}.yes`}>
                  Yes
                </label>
                <BooleanInput
                  type='radio'
                  id={`parameterForm.isRequired.${this.instanceCount}.no`}
                  class='is-checkradio is-rtl is-white'
                  value={false}
                  checked={!this.formState.value.isRequired}
                  onInput={value => this.onAction(new SetValueAction(this.formState.controls.isRequired.id, value))}
                />
                <label for={`parameterForm.isRequired.${this.instanceCount}.no`}>
                  No
                </label>
              </div>
            </div>
          </div>

          <div class='column is-narrow'>
            <div class='field'>
              <label class='label'>Value Type</label>
              <div class='control'>
                <div class='select'>
                  <select class='is-borderless' onChange={(e: Event) => this.updateValueType((e.target as HTMLSelectElement).value as any)}>
                    <option value='string'>string</option>
                    <option value='boolean'>boolean</option>
                    <option value='number'>number</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div class='column'>
            <div class='field'>
              <label class='label'>
                Default Value
              </label>

              {this.formState.value.valueType === 'string' &&
                <div class='control'>
                  <Input
                    class='input'
                    type='text'
                    value={this.formState.value.defaultValue as string}
                    onInput={value => this.onAction(new SetValueAction(this.formState.controls.defaultValue.id, value))}
                  />
                </div>
              }

              {this.formState.value.valueType === 'number' &&
                <div class='control'>
                  <NumberInput
                    class='input'
                    type='number'
                    value={this.formState.value.defaultValue as number}
                    onInput={value => this.onAction(new SetValueAction(this.formState.controls.defaultValue.id, value))}
                  />
                </div>
              }

              {this.formState.value.valueType === 'boolean' &&
                <div class='control radio-control'>

                  <BooleanInput
                    type='radio'
                    id={`parameterForm.defaultValue.${this.instanceCount}.true`}
                    class='is-checkradio is-rtl is-white'
                    value={true}
                    checked={this.formState.value.defaultValue as boolean}
                    onInput={value => this.onAction(new SetValueAction(this.formState.controls.defaultValue.id, value))}
                  />
                  <label for={`parameterForm.defaultValue.${this.instanceCount}.true`}>
                    True
                  </label>

                  <BooleanInput
                    type='radio'
                    id={`parameterForm.defaultValue.${this.instanceCount}.false`}
                    class='is-checkradio is-rtl is-white'
                    value={false}
                    checked={!this.formState.value.defaultValue}
                    onInput={value => this.onAction(new SetValueAction(this.formState.controls.defaultValue.id, value))}
                  />
                  <label for={`parameterForm.defaultValue.${this.instanceCount}.false`}>
                    False
                  </label>

                </div>
              }
            </div>
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
.select:not(.is-multiple) {
  height: 2.5em;
}

.radio-control {
  padding-top: 0.45rem;
  padding-bottom: 0.45rem;
}
</style>
