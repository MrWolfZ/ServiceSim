<script lang="tsx">
import { Action, AddArrayControlAction, FormGroupState, RemoveArrayControlAction } from 'pure-forms';
import { Component, Prop } from 'vue-property-decorator';
import { Emit, ExpansionContainer, FormField, TextInput, TsxComponent } from '../../ui-infrastructure';
import ParameterForm from '../parameter/parameter-form.vue';
import { ParameterFormValue } from '../parameter/parameter.types';
import { PredicateTemplateFormValue } from './predicate-template.types';

export interface PredicateTemplateFormProps {
  formState: FormGroupState<PredicateTemplateFormValue>;
  onAction: (action: Action) => any;
}

@Component({})
export default class PredicateTemplateForm extends TsxComponent<PredicateTemplateFormProps> implements PredicateTemplateFormProps {
  @Prop() formState: FormGroupState<PredicateTemplateFormValue>;

  @Emit()
  onAction(_: Action) { }

  private addParameter() {
    this.onAction(
      new AddArrayControlAction<ParameterFormValue>(
        this.formState.controls.parameters.id,
        {
          name: '',
          description: '',
          isRequired: true,
          valueType: 'string',
          defaultValue: '',
        },
      )
    );
  }

  private removeParameter(index: number) {
    this.onAction(new RemoveArrayControlAction(this.formState.controls.parameters.id, index));
  }

  render() {
    return (
      <div>

        <FormField
          controlState={this.formState.controls.name}
          errorMessages={{ required: 'Please enter a name' }}
        >
          <TextInput
            placeholder='Name'
            class='name-input'
            controlState={this.formState.controls.name}
            onAction={a => this.onAction(a)}
          />
        </FormField>

        <FormField
          controlState={this.formState.controls.description}
          errorMessages={{ required: 'Please enter a description' }}
        >
          <TextInput
            rows={3}
            placeholder='Description'
            controlState={this.formState.controls.description}
            onAction={a => this.onAction(a)}
          />
        </FormField>

        <FormField
          label='Function Body'
          controlState={this.formState.controls.evalFunctionBody}
          errorMessages={{ required: 'Please enter a function body' }}
        >
          <TextInput
            class='code'
            rows={5}
            controlState={this.formState.controls.evalFunctionBody}
            onAction={a => this.onAction(a)}
          />
        </FormField>

        <ExpansionContainer isExpanded={true}>

          <div class='tile is-ancestor parameters'>
            <div class='tile is-12 is-vertical is-parent'>

              <div class='tile is-12 is-child parameters-title'>
                <label class='label'>Parameters</label>
              </div>

              {
                this.formState.controls.parameters.controls.map((form, idx) =>
                  <ParameterForm
                    key={idx}
                    class='tile is-12 is-child box parameter'
                    formState={form}
                    onAction={a => this.onAction(a)}
                    onRemove={() => this.removeParameter(idx)}
                  />
                )
              }

              <div class='tile is-12 is-child'>
                <button
                  class='button is-primary'
                  type='button'
                  onClick={() => this.addParameter()}
                  disabled={this.formState.controls.parameters.isDisabled}
                >
                  <span>Add Parameter</span>
                  <span class='icon is-small'>
                    <fa-icon icon='plus' />
                  </span>
                </button>
              </div>

            </div>
          </div>

        </ExpansionContainer>

      </div>
    );
  }
}
</script>

<style scoped lang="scss">
.name-input {
  font-size: 120%;
  font-weight: bold;
}
</style>
