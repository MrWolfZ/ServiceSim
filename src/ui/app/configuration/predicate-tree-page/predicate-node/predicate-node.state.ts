import { PredicateNode, ResponseGenerator } from '../domain';

export interface PredicateNodeState {
  node: PredicateNode;
  childNodes: PredicateNodeState[];
  parameterValues: { [prop: string]: string | number | boolean };
  responseGenerator: ResponseGenerator | undefined;
  responseGeneratorParameterValues: { [prop: string]: string | number | boolean };
  isExpanded: boolean;
  isSelected: boolean;
}

export const INITIAL_PREDICATE_NODE_STATE: PredicateNodeState = {
  node: {
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
    isTopLevelNode: false,
  },
  childNodes: [],
  parameterValues: {},
  responseGenerator: undefined,
  responseGeneratorParameterValues: {},
  isExpanded: false,
  isSelected: false,
};
