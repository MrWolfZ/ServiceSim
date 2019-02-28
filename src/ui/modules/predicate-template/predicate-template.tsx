import { Action, box, Boxed, createFormGroupState, disable, FormGroupState, formStateReducer, unbox, updateArray, updateGroup, validate } from 'pure-forms';
import { required } from 'pure-forms/validation';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PredicateTemplateData } from 'src/domain/predicate-template';
import { stateful } from 'src/ui/infrastructure/stateful-component';
import { CancelButton, SaveButton } from 'src/ui/shared/common-components/button';
import { Page } from 'src/ui/shared/common-components/layout/page';
import { Form } from 'src/ui/shared/form-components/form';
import { validateParameterForm } from 'src/ui/shared/parameter/parameter-form';
import { navigateToPredicateTemplates, routeParams$ } from 'src/ui/shared/routing';
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

interface PredicateTemplatePageProps {
  templateIdParam: Observable<string>;
}

interface PredicateTemplatePageState {
  isSaving: boolean;
  templateId: string;
  formState: FormGroupState<PredicateTemplateFormValue>;
}

const initialState: PredicateTemplatePageState = {
  isSaving: false,
  templateId: 'new',
  formState: createFormState(),
};

export const PredicateTemplatePage = stateful<PredicateTemplatePageState, PredicateTemplatePageProps>(
  initialState,
  { templateIdParam: routeParams$.pipe(map(p => p.id)) },
  function PredicateTemplatePage({ templateIdParam, templateId, isSaving, formState, patchState }) {
    if (templateIdParam !== templateId) {
      templateId = templateIdParam;
      let formState = createFormState();

      if (templateId !== 'new') {
        const { id, version, ...rest } = predicateTemplates.state.templatesById[templateId];
        formState = createFormState({ ...rest, tags: box(rest.tags) });
      }

      patchState(() => ({
        templateId,
        isSaving: false,
        formState,
      }));

      return null;
    }

    return (
      <Page title={templateId === 'new' ? `Create new predicate template` : `Edit predicate template`}>
        <Form formState={formState} onAction={onFormAction}>
          <PredicateTemplateForm formState={formState} onAction={onFormAction} />

          <div class='buttons flex-row flex-end'>
            <CancelButton
              onClick={navigateToPredicateTemplates}
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
      patchState(s => ({ formState: formReducer(s.formState, action) }));
    }

    async function submitDialog() {
      if (formState.isInvalid) {
        return;
      }

      patchState(s => ({
        formState: disable(s.formState),
        isSaving: true,
      }));

      const data: PredicateTemplateData = {
        name: formState.value.name,
        description: formState.value.description,
        tags: unbox(formState.value.tags),
        evalFunctionBody: formState.value.evalFunctionBody,
        parameters: formState.value.parameters,
      };

      await createOrUpdateTemplate(data, templateId || undefined);

      patchState(() => ({ isSaving: false }));

      await navigateToPredicateTemplates();
    }

    async function createOrUpdateTemplate(data: PredicateTemplateData, id?: string) {
      if (!id) {
        await predicateTemplates.createAsync(data);
      } else {
        await predicateTemplates.updateAsync({ templateId: id, data });
      }
    }
  },
);

export default PredicateTemplatePage;
