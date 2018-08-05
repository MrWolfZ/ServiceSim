import { Action } from '@ngrx/store';

import { PredicateTemplateVersionSnapshot } from '../predicate-template';
import { ResponseGeneratorTemplateSnapshot } from '../response-generator-template';
import { PredicateNodeDto } from './predicate-node.dto';

export interface ResponseGenerator {
  name: string;
  templateInstanceOrGeneratorFunctionBody: {
    templateSnapshot: ResponseGeneratorTemplateSnapshot;
    parameterValues: { [prop: string]: string | number | boolean };
  } | string;
}

export interface PredicateNode extends PredicateNodeDto {
  nodeId: string;
  name: string;
  templateInstanceOrEvalFunctionBody: {
    templateSnapshot: PredicateTemplateVersionSnapshot;
    parameterValues: { [prop: string]: string | number | boolean };
  } | string;
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
  templateInstanceOrEvalFunctionBody: {
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
