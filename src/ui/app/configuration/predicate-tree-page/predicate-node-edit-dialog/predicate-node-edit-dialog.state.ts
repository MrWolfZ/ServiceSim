import { createFormGroupState, FormGroupState } from 'ngrx-forms';

import { Parameter, PredicateNode } from '../domain';
import { PredicateNodeEditDialogFormValue } from '../domain/predicate-node/predicate-node.dto';

export interface PredicateNodeEditDialogState {
  node: PredicateNode;
  parameters: Parameter[];
  nodeIsCustom: boolean;
  dialogIsOpen: boolean;
  dialogIsClosing: boolean;
  isSaving: boolean;
  formState: FormGroupState<PredicateNodeEditDialogFormValue>;
}

export const PREDICATE_NODE_EDIT_DIALOG_FORM_ID = 'configuration/predicate-tree-page/predicate-node-edit-dialog/FORM';

export const INITIAL_PREDICATE_NODE_EDIT_DIALOG_FORM_STATE = createFormGroupState<PredicateNodeEditDialogFormValue>(
  PREDICATE_NODE_EDIT_DIALOG_FORM_ID,
  {
    nodeName: '',
    nodeDescription: '',
    evalFunctionBody: '',
    parameterValues: {},
  },
);

export const INITIAL_PREDICATE_NODE_EDIT_DIALOG_STATE: PredicateNodeEditDialogState = {
  node: {
    nodeId: '',
    name: '',
    description: '',
    templateInfoOrCustomProperties: {
      templateSnapshot: {
        templateId: '',
        version: 0,
        name: '',
        description: '',
        evalFunctionBody: '',
        parameters: [],
      },
      parameterValues: {},
    },
    childNodeIdsOrResponseGenerator: undefined,
    isTopLevelNode: false,
  },
  parameters: [],
  nodeIsCustom: true,
  dialogIsOpen: false,
  dialogIsClosing: false,
  isSaving: false,
  formState: INITIAL_PREDICATE_NODE_EDIT_DIALOG_FORM_STATE,
};
