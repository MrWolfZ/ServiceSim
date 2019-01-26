import { Action, createFormGroupState, disable, FormGroupState, formStateReducer, updateArray, updateGroup, validate } from 'pure-forms';
import { required } from 'pure-forms/validation';
import { Form, State, stateful, StatefulComponentContext } from '../../ui-infrastructure';
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
  { isSaving, templateId, formState, patch }: State<PredicateTemplatePageState>,
  _: {},
  { router }: StatefulComponentContext,
) => {
  return (
    <div class='page'>
      <h1 class='title'>
        {!templateId ? `Create new predicate template` : `Edit predicate template`}
      </h1>

      <Form formState={formState} onAction={a => patch({ formState: formReducer(formState, a) })}>
        <PredicateTemplateForm formState={formState} onAction={a => patch({ formState: formReducer(formState, a) })} />

        <div class='buttons' style={{ display: 'flex', justifyContent: 'flex-end', flex: 1 }}>
          <button
            class='button is-danger is-outlined'
            style={{ transitionDuration: 0 }}
            type='button'
            onClick={navigateToList}
            disabled={isSaving}
          >
            Cancel
          </button>

          <button
            class={`button is-success ${isSaving ? 'is-loading' : ''}`}
            style={{ transitionDuration: 0 }}
            onClick={submitDialog}
            disabled={isSaving || (formState.isInvalid && formState.isSubmitted)}
          >
            Save
          </button>
        </div>
      </Form>

    </div>
  );

  async function submitDialog() {
    if (formState.isInvalid) {
      return;
    }

    formState = disable(formState);

    patch({ isSaving: true, formState });

    await createOrUpdateTemplate({
      ...formState.value,
      parameters: formState.value.parameters.map(p => ({ ...p })),
    }, templateId || undefined);

    patch({ isSaving: false });

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
    router.push('/predicate-templates');
  }
};

function initialize({ isSaving, formState, patch }: State<PredicateTemplatePageState>, templateId: string | null | undefined) {
  templateId = templateId && templateId !== 'new' ? templateId : null;
  isSaving = false;
  formState = createFormState();

  if (templateId) {
    const { id, version, ...rest } = predicateTemplates.state.templatesById[templateId];
    formState = createFormState(rest);
  }

  patch({ isSaving, formState });
}

export const PredicateTemplatePage = stateful(PredicateTemplatePageDef, initialState, {
  mounted: (state, { route }) => initialize(state, route.params.id),

  beforeRouteUpdate: (state, to, _, next) => {
    initialize(state, to.params.id);
    next();
  },
});

export default PredicateTemplatePage;
