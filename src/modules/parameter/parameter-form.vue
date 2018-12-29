<script lang="tsx">
import { Component, Emit, Prop } from 'vue-property-decorator';
import { BooleanInput, Input, NumberInput, TsxComponent } from '../../ui-infrastructure';
import { Parameter } from './parameter';

export type ParameterFormValue = Parameter;

export interface ParameterFormProps {
  formValue: ParameterFormValue;
  onChange: (newValue: ParameterFormValue) => any;
  onRemove: () => any;
}

let instanceCount = 0;

@Component({
  components: {
    Input,
    BooleanInput,
    NumberInput,
  },
})
export default class ParameterForm extends TsxComponent<ParameterFormProps> {
  @Prop() formValue: ParameterFormValue;

  private instanceCount = instanceCount++;

  @Emit('change')
  private onChange(change: Partial<ParameterFormValue>) {
    return { ...this.formValue, ...change };
  }

  @Emit('remove')
  private remove() {
    // we just need to emit
  }

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

    this.onChange({ valueType: newValueType, defaultValue: newDefaultValue } as Partial<ParameterFormValue>);
  }

  render() {
    return (
      <div>

        <div class='field'>
          <label class='label'>
            Parameter Name
          </label>
          <div class='control'>
            <Input
              class='input'
              type='text'
              value={this.formValue.name}
              onInput={value => this.onChange({ name: value })}
            />
            {!this.formValue.name &&
              <span class='help is-danger'>
                Please enter a name
              </span>
            }
          </div>
        </div>

        <div class='field'>
          <label class='label'>
            Description
          </label>
          <div class='control'>
            <Input
              class='input'
              type='text'
              value={this.formValue.description}
              onInput={value => this.onChange({ description: value })}
            />
            {!this.formValue.description &&
              <span class='help is-danger'>
                Please enter a description
              </span>
            }
          </div>
        </div>

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
                  checked={this.formValue.isRequired}
                  onInput={value => this.onChange({ isRequired: value })}
                />
                <label for={`parameterForm.isRequired.${this.instanceCount}.yes`}>
                  Yes
                </label>
                <BooleanInput
                  type='radio'
                  id={`parameterForm.isRequired.${this.instanceCount}.no`}
                  class='is-checkradio is-rtl is-white'
                  value={false}
                  checked={!this.formValue.isRequired}
                  onInput={value => this.onChange({ isRequired: value })}
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

              {this.formValue.valueType === 'string' &&
                <div class='control'>
                  <Input
                    class='input'
                    type='text'
                    value={this.formValue.defaultValue as string}
                    onInput={value => this.onChange({ defaultValue: value })}
                  />
                </div>
              }

              {this.formValue.valueType === 'number' &&
                <div class='control'>
                  <NumberInput
                    class='input'
                    type='number'
                    value={this.formValue.defaultValue as number}
                    onInput={value => this.onChange({ defaultValue: value })}
                  />
                </div>
              }

              {this.formValue.valueType === 'boolean' &&
                <div class='control radio-control'>

                  <BooleanInput
                    type='radio'
                    id={`parameterForm.defaultValue.${this.instanceCount}.true`}
                    class='is-checkradio is-rtl is-white'
                    value={true}
                    checked={this.formValue.defaultValue as boolean}
                    onInput={value => this.onChange({ defaultValue: value })}
                  />
                  <label for={`parameterForm.defaultValue.${this.instanceCount}.true`}>
                    True
                  </label>

                  <BooleanInput
                    type='radio'
                    id={`parameterForm.defaultValue.${this.instanceCount}.false`}
                    class='is-checkradio is-rtl is-white'
                    value={false}
                    checked={!this.formValue.defaultValue}
                    onInput={value => this.onChange({ defaultValue: value })}
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
          onClick={() => this.remove()}
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
