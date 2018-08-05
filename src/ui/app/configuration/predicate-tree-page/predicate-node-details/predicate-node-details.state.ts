import { PredicateNode, ResponseGenerator } from '../domain';

export interface PredicateNodeDetailsState {
  node: PredicateNode;
  childNodeNames: { [nodeId: string]: string };
  hasTemplate: boolean;
  templateName: string;
  parameterValues: { [prop: string]: string | number | boolean };
  customEvalFunctionBody: string;
  responseGenerator: ResponseGenerator | undefined;
  responseGeneratorHasTemplate: boolean;
  responseGeneratorTemplateName: string;
  responseGeneratorParameterValues: { [prop: string]: string | number | boolean };
  responseGeneratorCustomGenerateFunctionBody: string;
}

export const INITIAL_PREDICATE_NODE_DETAILS_STATE: PredicateNodeDetailsState = {
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
  childNodeNames: {},
  hasTemplate: false,
  templateName: '',
  parameterValues: {},
  customEvalFunctionBody: '',
  responseGenerator: undefined,
  responseGeneratorHasTemplate: false,
  responseGeneratorTemplateName: '',
  responseGeneratorParameterValues: {},
  responseGeneratorCustomGenerateFunctionBody: '',
};
