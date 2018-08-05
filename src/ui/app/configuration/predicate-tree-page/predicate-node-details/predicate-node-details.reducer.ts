import { InitializePredicateNodeDetailsAction, PredicateNodeDetailsActions } from './predicate-node-details.actions';
import { INITIAL_PREDICATE_NODE_DETAILS_STATE, PredicateNodeDetailsState } from './predicate-node-details.state';

export function predicateNodeDetailsReducer(state = INITIAL_PREDICATE_NODE_DETAILS_STATE, action: PredicateNodeDetailsActions): PredicateNodeDetailsState {
  switch (action.type) {
    case InitializePredicateNodeDetailsAction.TYPE:
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

      if (typeof node.templateInstanceOrEvalFunctionBody !== 'string') {
        hasTemplate = true;
        templateName = node.templateInstanceOrEvalFunctionBody.templateSnapshot.name;
        parameterValues = node.templateInstanceOrEvalFunctionBody.parameterValues;
      }

      let responseGeneratorHasTemplate = false;
      let responseGeneratorTemplateName = '';
      let responseGeneratorParameterValues = {};

      if (responseGenerator && typeof responseGenerator.templateInstanceOrGeneratorFunctionBody !== 'string') {
        responseGeneratorHasTemplate = true;
        responseGeneratorTemplateName = responseGenerator.templateInstanceOrGeneratorFunctionBody.templateSnapshot.name;
        responseGeneratorParameterValues = responseGenerator.templateInstanceOrGeneratorFunctionBody.parameterValues;
      }

      return {
        node,
        childNodeNames,
        hasTemplate,
        templateName,
        parameterValues,
        responseGenerator,
        responseGeneratorHasTemplate,
        responseGeneratorTemplateName,
        responseGeneratorParameterValues,
      };

    default:
      return state;
  }
}
