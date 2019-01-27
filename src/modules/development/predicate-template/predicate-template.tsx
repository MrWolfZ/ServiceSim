import { Action, createFormGroupState, disable, FormGroupState, formStateReducer, updateArray, updateGroup, validate } from 'pure-forms';
import { required } from 'pure-forms/validation';
import { CancelButton, Form, page, SaveButton, StatefulComponentContext } from 'src/ui-infrastructure';
import { validateParameterForm } from '../parameter/parameter-form';
import { PredicateTemplateForm } from './predicate-template-form';
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
    <div class='page'>
      <h1 class='title'>
        {!templateId ? `Create new predicate template` : `Edit predicate template`}
      </h1>

      <Form formState={formState} onAction={onFormAction}>
        <PredicateTemplateForm formState={formState} onAction={onFormAction} />

        <div class='buttons' style={{ display: 'flex', justifyContent: 'flex-end', flex: 1 }}>
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

    </div>
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

    await createOrUpdateTemplate(formState.value, templateId || undefined);

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
    state.formState = createFormState(rest);
  }
}

export const PredicateTemplatePage = page(PredicateTemplatePageDef, initialState, {
  mounted: (state, { route }) => initialize(state, route.params.id),

  beforeRouteUpdate: (state, to, _, next) => {
    initialize(state, to.params.id);
    next();
  },
});

export default PredicateTemplatePage;
