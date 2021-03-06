<script lang="tsx">
import { Action, createFormGroupState, FormGroupState, formStateReducer } from 'pure-forms';
import { Component } from 'vue-property-decorator';
import { Emit, Form, ModalDialog, TsxComponent } from '../../ui-infrastructure';
import { Parameter } from '../parameter/parameter.types';
import PredicateNodeForm from './predicate-node-form.vue';
import { PredicateNodeFormValue, PredicateNodeState } from './predicate-node.types';
import { validatePredicateNodeForm } from './predicate-node.validation';

export interface PredicateNodeDialogProps {
  onSubmit: (data: PredicateNodeFormValue, nodeId?: string) => any;
}

export const EMPTY_PREDICATE_TEMPLATE_FORM_VALUE: PredicateNodeFormValue = {
  name: '',
  description: '',
  evalFunctionBody: '',
  parameterValues: {},
};

const createFormState = (value = EMPTY_PREDICATE_TEMPLATE_FORM_VALUE) =>
  Object.freeze(validatePredicateNodeForm(createFormGroupState('predicateNodeDialog', value)));

function formReducer(state: FormGroupState<PredicateNodeFormValue>, action: Action) {
  return Object.freeze(validatePredicateNodeForm(formStateReducer(state, action)));
}

@Component({})
export default class PredicateNodeDialog extends TsxComponent<PredicateNodeDialogProps> implements PredicateNodeDialogProps {
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

          <div slot='footer' class='buttons'>
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
          </div>

        </ModalDialog>
      </Form >
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
