import { Action, createFormGroupState, FormGroupState, formStateReducer, updateGroup, validate } from 'pure-forms';
import { minLength, required } from 'pure-forms/validation';
import { Parameter } from 'src/domain/parameter';
import { Emit } from 'src/ui/infrastructure/decorators';
import { TsxComponent } from 'src/ui/infrastructure/tsx-component';
import { CancelButton, SaveButton } from 'src/ui/shared/common-components/button';
import { Form } from 'src/ui/shared/form-components/form';
import { ModalDialog } from 'src/ui/shared/modal-dialog';
import { Component } from 'vue-property-decorator';
import { PredicateNodeForm, PredicateNodeFormValue } from './predicate-node-form';
import { PredicateNodeState } from './predicate-node.store';

export interface PredicateNodeDialogProps {
  onSubmit: (data: PredicateNodeFormValue, nodeId?: string) => any;
}

export const EMPTY_PREDICATE_TEMPLATE_FORM_VALUE: PredicateNodeFormValue = {
  name: '',
  description: '',
  evalFunctionBody: '',
  parameterValues: {},
};

export const validatePredicateNodeForm = updateGroup<PredicateNodeFormValue>({
  name: validate(required),
  description: validate(required),
  evalFunctionBody: validate(minLength(1)),
});

const createFormState = (value = EMPTY_PREDICATE_TEMPLATE_FORM_VALUE) =>
  Object.freeze(validatePredicateNodeForm(createFormGroupState('predicateNodeDialog', value)));

function formReducer(state: FormGroupState<PredicateNodeFormValue>, action: Action) {
  return Object.freeze(validatePredicateNodeForm(formStateReducer(state, action)));
}

@Component({})
export class PredicateNodeDialog extends TsxComponent<PredicateNodeDialogProps> implements PredicateNodeDialogProps {
  private dialogIsOpen = false;
  private nodeId: string | undefined = undefined;
  private parameters: Parameter[] | undefined = undefined;

  private formState = createFormState();

  openForNewNode() {
    this.nodeId = undefined;
    this.parameters = undefined;
    this.dialogIsOpen = true;
    this.formState = createFormState();
  }

  openForExistingNode(node: PredicateNodeState) {
    this.nodeId = node.id;

    let evalFunctionBody = '';
    let parameterValues = {};
    this.parameters = undefined;

    if (typeof node.templateInfoOrEvalFunctionBody === 'string') {
      evalFunctionBody = node.templateInfoOrEvalFunctionBody;
    } else {
      this.parameters = node.templateInfoOrEvalFunctionBody.templateDataSnapshot.parameters;
      parameterValues = node.templateInfoOrEvalFunctionBody.parameterValues;
    }

    this.dialogIsOpen = true;
    this.formState = createFormState({
      name: node.name,
      description: node.description,
      evalFunctionBody,
      parameterValues,
    });
  }

  @Emit()
  onSubmit(_1: PredicateNodeFormValue, _2?: string) { }

  private submitDialog() {
    if (this.formState.isInvalid) {
      return;
    }

    this.onSubmit({
      ...this.formState.value,
      parameterValues: {
        ...this.formState.value.parameterValues,
      },
    }, this.nodeId);

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
        <ModalDialog isOpen={this.dialogIsOpen} onAfterFadeOut={() => { this.formState = createFormState(); this.parameters = undefined; }}>

          <span slot='header'>
            {!this.nodeId ? `Create new predicate node` : `Edit predicate node`}
          </span>

          <PredicateNodeForm parameters={this.parameters} formState={this.formState} onAction={a => this.formState = formReducer(this.formState, a)} />

          <div slot='footer' class='buttons' style={{ display: 'flex', justifyContent: 'flex-end', flex: 1 }}>
            <CancelButton
              onClick={() => this.cancelDialog()}
            />

            <SaveButton
              onClick={() => this.submitDialog()}
              isDisabled={this.formState.isInvalid && this.formState.isSubmitted}
            />
          </div>

        </ModalDialog>
      </Form >
    );
  }
}
