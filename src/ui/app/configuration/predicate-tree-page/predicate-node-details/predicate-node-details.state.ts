import { PredicateNode, ResponseGenerator } from '../domain';

export interface PredicateNodeDetailsState {
  node: PredicateNode;
  childNodeNames: { [nodeId: string]: string };
  hasTemplate: boolean;
  templateName: string;
  parameterValues: { [prop: string]: string | number | boolean };
  responseGenerator: ResponseGenerator | undefined;
  responseGeneratorHasTemplate: boolean;
  responseGeneratorTemplateName: string;
  responseGeneratorParameterValues: { [prop: string]: string | number | boolean };
}

export const INITIAL_PREDICATE_NODE_DETAILS_STATE: PredicateNodeDetailsState = {
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
  childNodeNames: {},
  hasTemplate: false,
  templateName: '',
  parameterValues: {},
  responseGenerator: undefined,
  responseGeneratorHasTemplate: false,
  responseGeneratorTemplateName: '',
  responseGeneratorParameterValues: {},
};
