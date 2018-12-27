<script lang="tsx">
import { Component, Vue } from 'vue-property-decorator';
import Input from '../infrastructure/form-components/input.vue';
import TextArea from '../infrastructure/form-components/textarea.vue';
import ParameterForm, { ParameterFormValue } from './parameter-form.vue';

export interface PredicateTemplateFormValue {
  name: string;
  description: string;
  evalFunctionBody: string;
  parameters: ParameterFormValue[];
}

@Component({
  components: {
    ParameterForm,
    Input,
  },
})
export default class PredicateTemplateForm extends Vue {
  private name = '';
  private description = '';
  private evalFunctionBody = '';
  private parameters: ParameterFormValue[] = [];

  get value(): PredicateTemplateFormValue {
    return {
      name: this.name,
      description: this.description,
      evalFunctionBody: this.evalFunctionBody,
      parameters: this.parameters,
    };
  }

  get isValid() {
    return !!this.name && !!this.description && !!this.evalFunctionBody;
  }

  get isInvalid() {
    return !this.isValid;
  }

  initialize(value: PredicateTemplateFormValue) {
    this.name = value.name;
    this.description = value.description;
    this.evalFunctionBody = value.evalFunctionBody;
    this.parameters = value.parameters;
  }

  private addParameter() {
    this.parameters.push({
      name: '',
      description: '',
      isRequired: true,
      valueType: 'string',
      defaultValue: '',
    });
  }

  private removeParameter(index: number) {
    this.parameters.splice(index, 1);
  }

  render() {
    return (
      <div>

        <div class='field title'>
          <p class='control'>
            <Input class='input'
                   type='text'
                   placeholder='Name'
                   value={this.name}
                   onInput={value => this.name = value} />
            { !this.name &&
              <span class='help is-danger'>
                Please enter a name
              </span>
            }
          </p>
        </div>

        <div class='field'>
          <p class='control'>
            <TextArea class='textarea'
                      rows={3}
                      placeholder='Description'
                      value={this.description}
                      onInput={value => this.description = value}>
            </TextArea>
            { !this.description &&
              <span class='help is-danger'>
                Please enter a description
              </span>
            }
          </p>
        </div>

        <div class='field'>
          <label class='label'>Function Body</label>
          <p class='control'>
            <TextArea class='textarea code'
                      rows={5}
                      value={this.evalFunctionBody}
                      onInput={value => this.evalFunctionBody = value}>
            </TextArea>
            { !this.evalFunctionBody &&
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
              this.parameters.map((fv, idx) =>
                <ParameterForm class='tile is-12 is-child box parameter'
                               formValue={fv}
                               onRemove={() => this.removeParameter(idx)}>
                </ParameterForm>
              )
            }

            <div class='tile is-12 is-child'>
              <button class='button is-primary'
                      type='button'
                      onClick={() => this.addParameter()}>
                <span>Add Parameter</span>
                <span class='icon is-small'>
                  <fa-icon icon='plus'></fa-icon>
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
