<script lang="tsx">
import { Component, Emit, Prop } from 'vue-property-decorator';
import { Parameter } from '../domain';
import Input, { BooleanInput, NumberInput } from '../infrastructure/form-components/input.vue';
import TsxComponent from '../infrastructure/tsx-component';

export type ParameterFormValue = Parameter;

let instanceCount = 0;

@Component({
  components: {
    Input,
    BooleanInput,
    NumberInput,
  },
})
export default class ParameterForm extends TsxComponent<{ formValue: ParameterFormValue; onRemove: () => void }> {
  @Prop() formValue: ParameterFormValue;

  private instanceCount = instanceCount++;
  private name = '';
  private description = '';
  private isRequired = false;
  private valueType: ParameterFormValue['valueType'] = 'string';
  private defaultValue: ParameterFormValue['defaultValue'] = '';

  created() {
    this.name = this.formValue.name;
    this.description = this.formValue.description;
    this.isRequired = this.formValue.isRequired;
    this.valueType = this.formValue.valueType;
    this.defaultValue = this.formValue.defaultValue;
  }

  private updateValueType(newValueType: ParameterFormValue['valueType']) {
    this.valueType = newValueType;

    switch (this.valueType) {
      case 'string':
      default:
        this.defaultValue = '';
        break;

      case 'number':
        this.defaultValue = 0;
        break;

      case 'boolean':
        this.defaultValue = false;
        break;
    }
  }

  @Emit('remove')
  private remove() {
    // we just need to emit
  }

  render() {
    return (
      <div>

        <div class='field'>
          <label class='label'>
            Parameter Name
          </label>
          <div class='control'>
            <Input class='input'
                   type='text'
                   value={this.name}
                   onInput={value => this.name = value} />
            { !this.name &&
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
            <Input class='input'
                   type='text'
                   value={this.description}
                   onInput={value => this.description = value} />
            { !this.description &&
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
                <BooleanInput type='radio'
                              id={`parameterForm.isRequired.${this.instanceCount}.yes`}
                              class='is-checkradio is-rtl is-white'
                              value={true}
                              checked={this.isRequired}
                              onInput={value => this.isRequired = value} />
                <label for={`parameterForm.isRequired.${this.instanceCount}.yes`}>
                  Yes
                </label>
                <BooleanInput type='radio'
                              id={`parameterForm.isRequired.${this.instanceCount}.no`}
                              class='is-checkradio is-rtl is-white'
                              value={false}
                              checked={!this.isRequired}
                              onInput={value => this.isRequired = value} />
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

              { this.valueType === 'string' &&
                <div class='control'>
                  <Input class='input'
                         type='text'
                         value={this.defaultValue as string}
                         onInput={value => this.defaultValue = value} />
                </div>
              }

              { this.valueType === 'number' &&
                <div class='control'>
                  <NumberInput class='input'
                               type='number'
                               value={this.defaultValue as number}
                               onInput={value => this.defaultValue = value} />
                </div>
              }

              { this.valueType === 'boolean' &&
                <div class='control radio-control'>

                  <BooleanInput type='radio'
                                id={`parameterForm.defaultValue.${this.instanceCount}.true`}
                                class='is-checkradio is-rtl is-white'
                                value={true}
                                checked={this.defaultValue as boolean}
                                onInput={value => this.defaultValue = value} />
                  <label for={`parameterForm.defaultValue.${this.instanceCount}.true`}>
                    True
                  </label>

                  <BooleanInput type='radio'
                                id={`parameterForm.defaultValue.${this.instanceCount}.false`}
                                class='is-checkradio is-rtl is-white'
                                value={false}
                                checked={!this.defaultValue}
                                onInput={value => this.defaultValue = value} />
                  <label for={`parameterForm.defaultValue.${this.instanceCount}.false`}>
                    False
                  </label>

                </div>
              }
            </div>
          </div>

        </div>

        <button class='button is-danger'
                type='button'
                onClick={() => this.remove()}>
          <span>Remove</span>
          <span class='icon is-small'>
            <fa-icon icon='times'></fa-icon>
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
