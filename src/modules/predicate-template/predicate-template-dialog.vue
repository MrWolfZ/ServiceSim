<script lang="tsx">
import { Action, createFormGroupState, disable, FormGroupState, formStateReducer, updateArray, updateGroup, validate } from 'pure-forms';
import { required } from 'pure-forms/validation';
import { Component } from 'vue-property-decorator';
import { Form, ModalDialog, TsxComponent } from '../../ui-infrastructure';
import { validateParameterForm } from '../parameter/parameter-form.vue';
import PredicateTemplateForm from './predicate-template-form.vue';
import predicateTemplates from './predicate-template.store';
import { PredicateTemplateData, PredicateTemplateFormValue } from './predicate-template.types';

export const EMPTY_PREDICATE_TEMPLATE_FORM_VALUE: PredicateTemplateFormValue = {
  name: '',
  description: '',
  evalFunctionBody: '',
  parameters: [],
};

export const validatePredicateTemplateForm = updateGroup<PredicateTemplateFormValue>({
  name: validate(required),
  description: validate(required),
  evalFunctionBody: validate(required),
  parameters: updateArray(validateParameterForm),
});

const createFormState = (value = EMPTY_PREDICATE_TEMPLATE_FORM_VALUE) =>
  Object.freeze(validatePredicateTemplateForm(createFormGroupState('predicateTemplateDialog', value)));

function formReducer(state: FormGroupState<PredicateTemplateFormValue>, action: Action) {
  return Object.freeze(validatePredicateTemplateForm(formStateReducer(state, action)));
}

@Component({})
export default class PredicateTemplateDialog extends TsxComponent<{}> {
  private dialogIsOpen = false;
  private isSaving = false;
  private templateId: string | undefined;

  private formState = createFormState();

  openForNewTemplate() {
    this.templateId = undefined;
    this.dialogIsOpen = true;
    this.isSaving = false;
    this.formState = createFormState();
  }

  openForExistingTemplate(templateId: string) {
    this.templateId = templateId;
    this.dialogIsOpen = true;
    this.isSaving = false;
    const { id, version, ...rest } = predicateTemplates.state.templatesById[templateId];
    this.formState = createFormState(rest);
  }

  private async submitDialog() {
    if (this.formState.isInvalid) {
      return;
    }

    this.isSaving = true;
    this.formState = disable(this.formState);

    await this.createOrUpdateTemplate({
      ...this.formState.value,
      parameters: this.formState.value.parameters.map(p => ({ ...p })),
    }, this.templateId);

    this.closeDialog();
  }

  private async createOrUpdateTemplate(data: PredicateTemplateData, id?: string) {
    if (!id) {
      await predicateTemplates.createAsync(data);
    } else {
      await predicateTemplates.updateAsync({ templateId: id, data });
    }
  }

  private cancelDialog() {
    this.closeDialog();
  }

  private closeDialog() {
    this.dialogIsOpen = false;
  }

  render() {
    return (
      <Form formState={this.formState} onAction={a => this.formState = formReducer(this.formState, a)}>
        <ModalDialog isOpen={this.dialogIsOpen} onAfterFadeOut={() => this.formState = createFormState()}>

          <span slot='header'>
            {!this.templateId ? `Create new predicate template` : `Edit predicate template`}
          </span>

          <PredicateTemplateForm formState={this.formState} onAction={a => this.formState = formReducer(this.formState, a)} />

          <div slot='footer' class='buttons'>
            <button
              class='button is-danger is-outlined'
              type='button'
              onClick={() => this.cancelDialog()}
              disabled={this.isSaving}
            >
              Cancel
            </button>
            <button
              class={`button is-success ${this.isSaving ? 'is-loading' : ''}`}
              onClick={() => this.submitDialog()}
              disabled={this.isSaving || (this.formState.isInvalid && this.formState.isSubmitted)}
            >
              Save
            </button>
          </div>

        </ModalDialog>
      </Form>
    );
  }
}
</script>

<style scoped lang="scss">
.buttons {
  display: flex;
  justify-content: flex-end;
  flex: 1;
}

.button {
  transition-duration: 0ms;
}
</style>
