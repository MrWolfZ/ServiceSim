import { Action, box, Boxed, createFormGroupState, disable, FormGroupState, formStateReducer, unbox, updateArray, updateGroup, validate } from 'pure-forms';
import { required } from 'pure-forms/validation';
import { PredicateTemplateData } from 'src/domain/predicate-template';
import { page, StatefulComponentContext } from 'src/ui/infrastructure/tsx';
import { CancelButton, SaveButton } from 'src/ui/shared/common-components/button';
import { Page } from 'src/ui/shared/common-components/page';
import { Form } from 'src/ui/shared/form-components/form';
import { validateParameterForm } from 'src/ui/shared/parameter/parameter-form';
import { PredicateTemplateForm } from './predicate-template-form';
import predicateTemplates from './predicate-template.store';

export interface PredicateTemplateFormValue extends Omit<PredicateTemplateData, 'tags'> {
  tags: Boxed<string[]>;
}

export const EMPTY_PREDICATE_TEMPLATE_FORM_VALUE: PredicateTemplateFormValue = {
  name: '',
  description: '',
  tags: box([]),
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

interface PredicateTemplatePageState {
  isSaving: boolean;
  templateId: string | null;
  formState: FormGroupState<PredicateTemplateFormValue>;
}

const initialState: PredicateTemplatePageState = {
  isSaving: false,
  templateId: null,
  formState: createFormState(),
};

export const PredicateTemplatePageDef = (
  state: PredicateTemplatePageState,
  { router }: StatefulComponentContext,
) => {
  const { templateId, isSaving, formState } = state;

  return (
    <Page title={!templateId ? `Create new predicate template` : `Edit predicate template`}>
      <Form formState={formState} onAction={onFormAction}>
        <PredicateTemplateForm formState={formState} onAction={onFormAction} />

        <div class='buttons flex-row flex-end'>
          <CancelButton
            onClick={navigateToList}
            isDisabled={isSaving}
          />

          <SaveButton
            onClick={submitDialog}
            isDisabled={isSaving || (formState.isInvalid && formState.isSubmitted)}
            isSaving={isSaving}
          />
        </div>
      </Form>
    </Page>
  );

  function onFormAction(action: Action) {
    state.formState = formReducer(state.formState, action);
  }

  async function submitDialog() {
    if (formState.isInvalid) {
      return;
    }

    state.formState = disable(formState);
    state.isSaving = true;

    const data: PredicateTemplateData = {
      name: formState.value.name,
      description: formState.value.description,
      tags: unbox(formState.value.tags),
      evalFunctionBody: formState.value.evalFunctionBody,
      parameters: formState.value.parameters,
    };

    await createOrUpdateTemplate(data, templateId || undefined);

    state.isSaving = false;

    navigateToList();
  }

  async function createOrUpdateTemplate(data: PredicateTemplateData, id?: string) {
    if (!id) {
      await predicateTemplates.createAsync(data);
    } else {
      await predicateTemplates.updateAsync({ templateId: id, data });
    }
  }

  function navigateToList() {
    router.push({ name: 'predicate-templates' });
  }
};

function initialize(state: PredicateTemplatePageState, templateId: string | null | undefined) {
  state.templateId = templateId = templateId && templateId !== 'new' ? templateId : null;
  state.isSaving = false;
  state.formState = createFormState();

  if (templateId) {
    const { id, version, ...rest } = predicateTemplates.state.templatesById[templateId];
    state.formState = createFormState({ ...rest, tags: box(rest.tags) });
  }
}

export const PredicateTemplatePage = page(PredicateTemplatePageDef, initialState, {
  created: (state, _, { route }) => initialize(state, route.params.id),

  beforeRouteUpdate: (state, to, _, next) => {
    initialize(state, to.params.id);
    next();
  },
});

export default PredicateTemplatePage;
