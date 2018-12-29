<script lang="tsx">
import uuid from 'uuid';
import { Component, Emit } from 'vue-property-decorator';
import { TsxComponent } from '../../ui-infrastructure';
import { ParameterFormValue } from '../parameter/parameter-form.vue';
import PredicateTemplateForm, { EMPTY_PREDICATE_TEMPLATE_FORM_VALUE, PredicateTemplateFormValue } from './predicate-template-form.vue';
import { PredicateTemplate } from './predicate-template.store';

export interface PredicateTemplateDialogProps {
  onSubmit: (newValue: PredicateTemplate) => any;
}

@Component({
  components: {
    PredicateTemplateForm,
  },
})
export default class PredicateTemplateDialog extends TsxComponent<PredicateTemplateDialogProps> {
  private dialogIsOpen = false;
  private templateId: string | undefined;
  private formValue: PredicateTemplateFormValue = EMPTY_PREDICATE_TEMPLATE_FORM_VALUE;

  openForNewTemplate() {
    this.templateId = undefined;
    this.dialogIsOpen = true;
    this.formValue = EMPTY_PREDICATE_TEMPLATE_FORM_VALUE;
  }

  openForExistingTemplate(template: PredicateTemplate) {
    this.templateId = template.id;
    this.dialogIsOpen = true;
    const { id, ...rest } = template;
    this.formValue = rest;
  }

  @Emit('submit')
  private onSubmit(): PredicateTemplate {
    return {
      id: this.templateId || uuid(),
      ...this.formValue,
      parameters: this.formValue.parameters.map(p => ({ ...p })),
    };
  }

  private submitDialog() {
    this.onSubmit();
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
      <form novalidate='novalidate' onSubmit={(e: Event) => e.preventDefault()}>
        <div class={`modal ${this.dialogIsOpen ? `is-active` : ``}`}>
          <div class='modal-background' />
          <div class='modal-card'>
            <header class='modal-card-head'>
              <p class='modal-card-title'>
                {!this.templateId ? `Create new predicate template` : `Edit predicate template`}
              </p>
            </header>

            <section class='modal-card-body'>
              <PredicateTemplateForm formValue={this.formValue} onChange={fv => this.formValue = fv} />
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
                disabled={!isTemplateValid(this.formValue)}
              >
                Save
              </button>
            </footer>
          </div>
        </div>
      </form>
    );
  }
}

function isParameterValid(formValue: ParameterFormValue) {
  return !!formValue.name && !!formValue.description;
}

function isTemplateValid(formValue: PredicateTemplateFormValue) {
  return !!formValue.name && !!formValue.description && !!formValue.evalFunctionBody && formValue.parameters.every(isParameterValid);
}
</script>

<style scoped lang="scss">
.button {
  transition-duration: 0ms;
}
</style>
