import { Action } from '@ngrx/store';

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

export interface PredicateNodeEditFormValue {
  name: string;
  parameterValues: { [prop: string]: string | number | boolean };
}

export interface PredicateNodeCreateFormValue extends PredicateNodeEditFormValue {
  predicateTemplateId: string;
}

export class UpdatePredicateNodeAction implements Action {
  static readonly TYPE = 'configuration/predicate-tree-page/domain/predicate-node/UPDATE';
  readonly type = UpdatePredicateNodeAction.TYPE;

  constructor(
    public nodeId: string,
  ) { }
}

export type PredicateNodeActions =
  | UpdatePredicateNodeAction
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
