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

      return {
        ...state,
        node,
        childNodeNames,
        responseGenerator,
        templateNameIsVisible: node.name !== node.predicateTemplateVersionSnapshot.name,
        responseGeneratorTemplateNameIsVisible: !!responseGenerator && responseGenerator.name !== responseGenerator.templateVersionSnapshot.name,
      };

    default:
      return state;
  }
}
