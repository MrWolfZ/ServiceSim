import { PredicateNode, ResponseGenerator } from '../domain';

export interface PredicateNodeDetailsState {
  node: PredicateNode;
  childNodeNames: { [nodeId: string]: string };
  responseGenerator: ResponseGenerator | undefined;
  templateNameIsVisible: boolean;
  responseGeneratorTemplateNameIsVisible: boolean;
}

export const INITIAL_PREDICATE_NODE_DETAILS_STATE: PredicateNodeDetailsState = {
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
  childNodeNames: {},
  responseGenerator: undefined,
  templateNameIsVisible: false,
  responseGeneratorTemplateNameIsVisible: false,
};
