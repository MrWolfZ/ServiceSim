import { InitializePredicateNodeDetailsAction, PredicateNodeDetailsActions } from './predicate-node-details.actions';
import { INITIAL_PREDICATE_NODE_DETAILS_STATE, PredicateNodeDetailsState } from './predicate-node-details.state';

import { isPredicateTemplateInfo, isResponseGeneratorTemplateInfo, PredicateNodeUpdatedAction } from '../domain';

export function predicateNodeDetailsReducer(
  state = INITIAL_PREDICATE_NODE_DETAILS_STATE,
  action: PredicateNodeDetailsActions | PredicateNodeUpdatedAction,
): PredicateNodeDetailsState {
  switch (action.type) {
    case InitializePredicateNodeDetailsAction.TYPE: {
      const node = action.domainState.nodes.find(n => n.nodeId === action.nodeId)!;

      let childNodeNames: { [nodeId: string]: string } = {};

      if (Array.isArray(node.childNodeIdsOrResponseGenerator)) {
        const childNodeIds = node.childNodeIdsOrResponseGenerator;
        childNodeNames = action.domainState
          .nodes
          .filter(n => childNodeIds.indexOf(n.nodeId) >= 0)
          .reduce((agg, n) => ({ ...agg, [n.nodeId]: n.name }), {});
      }

      const responseGenerator =
        node.childNodeIdsOrResponseGenerator !== undefined && !Array.isArray(node.childNodeIdsOrResponseGenerator)
          ? node.childNodeIdsOrResponseGenerator
          : undefined;

      let hasTemplate = false;
      let templateName = '';
      let parameterValues = {};
      let customEvalFunctionBody = '';

      if (isPredicateTemplateInfo(node.templateInfoOrCustomProperties)) {
        hasTemplate = true;
        templateName = node.templateInfoOrCustomProperties.templateSnapshot.name;
        parameterValues = node.templateInfoOrCustomProperties.parameterValues;
      } else {
        customEvalFunctionBody = node.templateInfoOrCustomProperties.evalFunctionBody;
      }

      let responseGeneratorHasTemplate = false;
      let responseGeneratorTemplateName = '';
      let responseGeneratorParameterValues = {};
      let responseGeneratorCustomGenerateFunctionBody = '';

      if (responseGenerator) {
        if (isResponseGeneratorTemplateInfo(responseGenerator.templateInfoOrCustomProperties)) {
          responseGeneratorHasTemplate = true;
          responseGeneratorTemplateName = responseGenerator.templateInfoOrCustomProperties.templateSnapshot.name;
          responseGeneratorParameterValues = responseGenerator.templateInfoOrCustomProperties.parameterValues;
        } else {
          responseGeneratorCustomGenerateFunctionBody = responseGenerator.templateInfoOrCustomProperties.generateFunctionBody;
        }
      }

      return {
        node,
        childNodeNames,
        hasTemplate,
        templateName,
        parameterValues,
        customEvalFunctionBody,
        responseGenerator,
        responseGeneratorHasTemplate,
        responseGeneratorTemplateName,
        responseGeneratorParameterValues,
        responseGeneratorCustomGenerateFunctionBody,
      };
    }

    case PredicateNodeUpdatedAction.TYPE: {
      if (action.node.nodeId !== state.node.nodeId) {
        return state;
      }

      let parameterValues = {};
      let customEvalFunctionBody = '';

      if (isPredicateTemplateInfo(action.node.templateInfoOrCustomProperties)) {
        parameterValues = action.node.templateInfoOrCustomProperties.parameterValues;
      } else {
        customEvalFunctionBody = action.node.templateInfoOrCustomProperties.evalFunctionBody;
      }

      return {
        ...state,
        node: action.node,
        parameterValues,
        customEvalFunctionBody,
      };
    }

    default:
      return state;
  }
}
