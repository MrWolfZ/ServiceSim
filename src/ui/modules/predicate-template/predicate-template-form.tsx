import { Action, AddArrayControlAction, FormGroupState, RemoveArrayControlAction } from 'pure-forms';
import { pure } from 'src/ui/infrastructure/tsx';
import { PrimaryButton } from 'src/ui/shared/common-components/button';
import { ExpansionContainer } from 'src/ui/shared/expansion-container';
import { FormField } from 'src/ui/shared/form-components/form-field';
import { TextInput } from 'src/ui/shared/form-components/text-input';
import { ParameterForm, ParameterFormValue } from 'src/ui/shared/parameter/parameter-form';
import { PredicateTemplateFormValue } from './predicate-template';

export interface PredicateTemplateFormProps {
  formState: FormGroupState<PredicateTemplateFormValue>;
  onAction: (action: Action) => any;
}

const PredicateTemplateFormDef = ({ formState, onAction }: PredicateTemplateFormProps) => {
  return (
    <div>

      <FormField
        controlState={formState.controls.name}
        errorMessages={{ required: 'Please enter a name' }}
      >
        <TextInput
          placeholder='Name'
          styleOverride={{ fontSize: '120%', fontWeight: 'bold' }}
          controlState={formState.controls.name}
          onAction={onAction}
        />
      </FormField>

      <FormField
        controlState={formState.controls.description}
        errorMessages={{ required: 'Please enter a description' }}
      >
        <TextInput
          rows={3}
          placeholder='Description'
          controlState={formState.controls.description}
          onAction={onAction}
        />
      </FormField>

      <FormField
        label='Function Body'
        controlState={formState.controls.evalFunctionBody}
        errorMessages={{ required: 'Please enter a function body' }}
      >
        <TextInput
          class='code'
          rows={5}
          controlState={formState.controls.evalFunctionBody}
          onAction={onAction}
        />
      </FormField>

      <ExpansionContainer isExpanded={true}>

        <div class='tile is-ancestor parameters'>
          <div class='tile is-12 is-vertical is-parent'>

            <div class='tile is-12 is-child parameters-title'>
              <label class='label'>Parameters</label>
            </div>

            {
              formState.controls.parameters.controls.map((form, idx) =>
                <ParameterForm
                  key={idx}
                  className='tile is-12 is-child box parameter'
                  formState={form}
                  onAction={onAction}
                  onRemove={() => removeParameter(idx)}
                />
              )
            }

          </div>
        </div>

      </ExpansionContainer>

      <PrimaryButton
        label='Add Parameter'
        icon='plus'
        onClick={addParameter}
        isDisabled={formState.controls.parameters.isDisabled}
        styleOverride={{ marginTop: '1.5rem' }}
      />

    </div>
  );

  function addParameter() {
    onAction(
      new AddArrayControlAction<ParameterFormValue>(
        formState.controls.parameters.id,
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

  function removeParameter(index: number) {
    onAction(new RemoveArrayControlAction(formState.controls.parameters.id, index));
  }
};

export const PredicateTemplateForm = pure(PredicateTemplateFormDef);
