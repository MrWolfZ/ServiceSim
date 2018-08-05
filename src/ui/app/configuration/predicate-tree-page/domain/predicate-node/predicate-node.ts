import { Action } from '@ngrx/store';

import { PredicateTemplateVersionSnapshot } from '../predicate-template';
import { ResponseGeneratorTemplateVersionSnapshot } from '../response-generator-template';
import { PredicateNodeDto, ResponseGeneratorDto } from './predicate-node.dto';

export interface ResponseGenerator extends ResponseGeneratorDto {
  templateVersionSnapshot: ResponseGeneratorTemplateVersionSnapshot;
}

export interface PredicateNode extends PredicateNodeDto {
  predicateTemplateVersionSnapshot: PredicateTemplateVersionSnapshot;
  childNodeIdsOrResponseGenerator: string[] | ResponseGenerator | undefined;
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
  predicateTemplateVersionSnapshot: {
    templateId: '',
    version: 0,
    name: '',
    description: '',
    evalFunctionBody: '',
    parameters: [],
  },
  name: '',
  parameterValues: {},
  childNodeIdsOrResponseGenerator: undefined,
  isTopLevelNode: true,
};
