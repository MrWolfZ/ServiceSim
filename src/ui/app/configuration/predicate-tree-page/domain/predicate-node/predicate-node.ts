import { Action } from '@ngrx/store';

import { PredicateNodeEditDialogFormValue } from './predicate-node.dto';
import {
  PredicateCustomProperties,
  PredicateTemplateInfo,
  ResponseGeneratorCustomProperties,
  ResponseGeneratorTemplateInfo,
} from './template-info-or-custom-properties';

export interface ResponseGenerator {
  name: string;
  description: string;
  templateInfoOrCustomProperties: ResponseGeneratorTemplateInfo | ResponseGeneratorCustomProperties;
}

export interface PredicateNode {
  nodeId: string;
  name: string;
  description: string;
  templateInfoOrCustomProperties: PredicateTemplateInfo | PredicateCustomProperties;
  childNodeIdsOrResponseGenerator: string[] | ResponseGenerator | undefined;
  isTopLevelNode: boolean;
}

export class UpdatePredicateNodeAction implements Action {
  static readonly TYPE = 'configuration/predicate-tree-page/domain/predicate-node/UPDATE';
  readonly type = UpdatePredicateNodeAction.TYPE;

  constructor(
    public nodeId: string,
    public formValue: PredicateNodeEditDialogFormValue,
  ) { }
}

export class PredicateNodeUpdatedAction implements Action {
  static readonly TYPE = 'configuration/predicate-tree-page/domain/predicate-node/UPDATED';
  readonly type = PredicateNodeUpdatedAction.TYPE;

  constructor(
    public node: PredicateNode,
  ) { }
}

export type PredicateNodeActions =
  | UpdatePredicateNodeAction
  | PredicateNodeUpdatedAction
  ;

export const NULL_PREDICATE_NODE: PredicateNode = {
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
  isTopLevelNode: true,
};
