<script lang="tsx">
import { Action, createFormGroupState, FormGroupState, formStateReducer } from 'pure-forms';
import { Component } from 'vue-property-decorator';
import { Emit, Form, TsxComponent } from '../../ui-infrastructure';
import PredicateTemplateForm from './predicate-template-form.vue';
import { PredicateTemplateData, PredicateTemplateFormValue, PredicateTemplateState } from './predicate-template.types';
import { validatePredicateTemplateForm } from './predicate-template.validation';

export interface PredicateTemplateDialogProps {
  onSubmit: (data: PredicateTemplateData, id?: string) => any;
}

export const EMPTY_PREDICATE_TEMPLATE_FORM_VALUE: PredicateTemplateFormValue = {
  name: '',
  description: '',
  evalFunctionBody: '',
  parameters: [],
};

const createFormState = (value = EMPTY_PREDICATE_TEMPLATE_FORM_VALUE) =>
  Object.freeze(validatePredicateTemplateForm(createFormGroupState('predicateTemplateDialog', value)));

function formReducer(state: FormGroupState<PredicateTemplateFormValue>, action: Action) {
  return Object.freeze(validatePredicateTemplateForm(formStateReducer(state, action)));
}

@Component({})
export default class PredicateTemplateDialog extends TsxComponent<PredicateTemplateDialogProps> implements PredicateTemplateDialogProps {
  private dialogIsOpen = false;
  private templateId: string | undefined;

  private formState = createFormState();

  openForNewTemplate() {
    this.templateId = undefined;
    this.dialogIsOpen = true;
    this.formState = createFormState();
  }

  openForExistingTemplate(template: PredicateTemplateState) {
    this.templateId = template.id;
    this.dialogIsOpen = true;
    const { id, version, ...rest } = template;
    this.formState = createFormState(rest);
  }

  @Emit()
  onSubmit(_1: PredicateTemplateData, _2?: string) { }

  private submitDialog() {
    if (this.formState.isInvalid) {
      return;
    }

    this.onSubmit({
      ...this.formState.value,
      parameters: this.formState.value.parameters.map(p => ({ ...p })),
    }, this.templateId);

    this.closeDialog();
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
        <div class={`modal ${this.dialogIsOpen ? `is-active` : ``}`}>
          <div class='modal-background' />
          <div class='modal-card'>
            <header class='modal-card-head'>
              <p class='modal-card-title'>
                {!this.templateId ? `Create new predicate template` : `Edit predicate template`}
              </p>
            </header>

            <section class='modal-card-body'>
              <PredicateTemplateForm formState={this.formState} onAction={a => this.formState = formReducer(this.formState, a)} />
            </section>

            <footer class='modal-card-foot justify-content flex-end'>
              <button
                class='button is-danger is-outlined'
                type='button'
                onClick={() => this.cancelDialog()}
              >
                Cancel
              </button>
              <button
                class='button is-success'
                onClick={() => this.submitDialog()}
                disabled={this.formState.isInvalid && this.formState.isSubmitted}
              >
                Save
              </button>
            </footer>
          </div>
        </div>
      </Form>
    );
  }
}
</script>

<style scoped lang="scss">
.button {
  transition-duration: 0ms;
}
</style>
