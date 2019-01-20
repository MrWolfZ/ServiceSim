<script lang="tsx">
import { Action, createFormGroupState, disable, FormGroupState, formStateReducer, updateArray, updateGroup, validate } from 'pure-forms';
import { required } from 'pure-forms/validation';
import { Component } from 'vue-property-decorator';
import { Route } from 'vue-router';
import { Form, TsxComponent } from '../../ui-infrastructure';
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
export default class PredicateTemplatePage extends TsxComponent<{}> {
  private isSaving = false;
  private templateId: string | null = null;

  private formState = createFormState();

  mounted() {
    this.initialize(this.$route.params.id);
  }

  beforeRouteUpdate(to: Route, _: Route, next: () => void) {
    this.initialize(to.params.id);
    next();
  }

  initialize(templateId: string | null | undefined) {
    this.templateId = templateId && templateId !== 'new' ? templateId : null;
    this.isSaving = false;
    this.formState = createFormState();

    if (this.templateId) {
      const { id, version, ...rest } = predicateTemplates.state.templatesById[this.templateId];
      this.formState = createFormState(rest);
    }
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
    }, this.templateId || undefined);

    this.isSaving = false;
    this.navigateToList();
  }

  private async createOrUpdateTemplate(data: PredicateTemplateData, id?: string) {
    if (!id) {
      await predicateTemplates.createAsync(data);
    } else {
      await predicateTemplates.updateAsync({ templateId: id, data });
    }
  }

  private navigateToList() {
    this.$router.push('/predicate-templates');
  }

  render() {
    return (
      <div class='page'>
        <h1 class='title'>
          {!this.templateId ? `Create new predicate template` : `Edit predicate template`}
        </h1>

        <Form formState={this.formState} onAction={a => this.formState = formReducer(this.formState, a)}>
          <PredicateTemplateForm formState={this.formState} onAction={a => this.formState = formReducer(this.formState, a)} />
        </Form>

        <div class='buttons'>
          <button
            class='button is-danger is-outlined'
            type='button'
            onClick={() => this.navigateToList()}
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

      </div>
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
