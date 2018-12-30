<script lang="tsx">
import { Component, Emit, Prop } from 'vue-property-decorator';
import { Input, TextArea, TsxComponent } from '../../ui-infrastructure';
import ParameterForm, { ParameterFormValue } from '../parameter/parameter-form.vue';

export interface PredicateTemplateFormValue {
  name: string;
  description: string;
  evalFunctionBody: string;
  parameters: ParameterFormValue[];
}

export const EMPTY_PREDICATE_TEMPLATE_FORM_VALUE = {
  name: '',
  description: '',
  evalFunctionBody: '',
  parameters: [],
};

export interface PredicateTemplateFormProps {
  formValue: PredicateTemplateFormValue;
  onChange: (newValue: PredicateTemplateFormValue) => any;
}

@Component({
  components: {
    ParameterForm,
    Input,
  },
})
export default class PredicateTemplateForm extends TsxComponent<PredicateTemplateFormProps> {
  @Prop() formValue: PredicateTemplateFormValue;

  @Emit()
  onChange(change: Partial<PredicateTemplateFormValue>) {
    return { ...this.formValue, ...change };
  }

  private addParameter() {
    this.onChange({
      parameters: [
        ...this.formValue.parameters,
        {
          name: '',
          description: '',
          isRequired: true,
          valueType: 'string',
          defaultValue: '',
        },
      ],
    });
  }

  private updateParameter(index: number, newFormValue: ParameterFormValue) {
    this.onChange({
      parameters: this.spliceOne(index, this.formValue.parameters, newFormValue),
    });
  }

  private removeParameter(index: number) {
    this.onChange({
      parameters: this.spliceOne(index, this.formValue.parameters),
    });
  }

  private spliceOne<T>(index: number, arr: T[], ...items: T[]) {
    const copy = [...arr];
    copy.splice(index, 1, ...items);
    return copy;
  }

  render() {
    return (
      <div>

        <div class='field title'>
          <p class='control'>
            <Input
              class='input'
              type='text'
              placeholder='Name'
              value={this.formValue.name}
              onInput={value => this.onChange({ name: value })}
            />
            {!this.formValue.name &&
              <span class='help is-danger'>
                Please enter a name
              </span>
            }
          </p>
        </div>

        <div class='field'>
          <p class='control'>
            <TextArea
              class='textarea'
              rows={3}
              placeholder='Description'
              value={this.formValue.description}
              onInput={value => this.onChange({ description: value })}
            />
            {!this.formValue.description &&
              <span class='help is-danger'>
                Please enter a description
              </span>
            }
          </p>
        </div>

        <div class='field'>
          <label class='label'>Function Body</label>
          <p class='control'>
            <TextArea
              class='textarea code'
              rows={5}
              value={this.formValue.evalFunctionBody}
              onInput={value => this.onChange({ evalFunctionBody: value })}
            />
            {!this.formValue.evalFunctionBody &&
              <span class='help is-danger'>
                Please enter a function body
              </span>
            }
          </p>
        </div>

        <div class='tile is-ancestor parameters'>
          <div class='tile is-12 is-vertical is-parent'>
            <div class='tile is-12 is-child parameters-title'>
              <label class='label'>Parameters</label>
            </div>

            {
              this.formValue.parameters.map((fv, idx) =>
                <ParameterForm
                  key={idx}
                  class='tile is-12 is-child box parameter'
                  formValue={fv}
                  onChange={newFormValue => this.updateParameter(idx, newFormValue)}
                  onRemove={() => this.removeParameter(idx)}
                />
              )
            }

            <div class='tile is-12 is-child'>
              <button
                class='button is-primary'
                type='button'
                onClick={() => this.addParameter()}
              >
                <span>Add Parameter</span>
                <span class='icon is-small'>
                  <fa-icon icon='plus' />
                </span>
              </button>
            </div>
          </div>
        </div>

      </div>
    );
  }
}
</script>

<style scoped lang="scss">
</style>
