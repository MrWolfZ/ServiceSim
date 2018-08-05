import { PredicateNode, ResponseGenerator } from '../domain';

export interface PredicateNodeState {
  node: PredicateNode;
  childNodes: PredicateNodeState[];
  responseGenerator: ResponseGenerator | undefined;
  isExpanded: boolean;
  isSelected: boolean;
}

export const INITIAL_PREDICATE_NODE_STATE: PredicateNodeState = {
  node: {
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
    isTopLevelNode: false,
  },
  childNodes: [],
  responseGenerator: undefined,
  isExpanded: false,
  isSelected: false,
};
