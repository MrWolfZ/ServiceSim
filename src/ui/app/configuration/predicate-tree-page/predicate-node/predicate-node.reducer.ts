import { InitializePredicateNodeAction, PredicateNodeActions, SelectPredicateNodeAction, TogglePredicateNodeExpansionAction } from './predicate-node.actions';
import { INITIAL_PREDICATE_NODE_STATE, PredicateNodeState } from './predicate-node.state';

import { callNestedReducers, createArrayReducer } from 'app/infrastructure';

export function predicateNodeReducer(state = INITIAL_PREDICATE_NODE_STATE, action: PredicateNodeActions): PredicateNodeState {
  state = callNestedReducers<PredicateNodeState>(state, action, {
    childNodes: createArrayReducer(predicateNodeReducer),
  });

  switch (action.type) {
    case InitializePredicateNodeAction.TYPE:
      const node = action.domainState.nodes.find(n => n.nodeId === action.nodeId)!;

      let childNodes: PredicateNodeState[] = [];

      if (Array.isArray(node.childNodeIdsOrResponseGenerator)) {
        const childNodeIds = node.childNodeIdsOrResponseGenerator;
        childNodes = action.domainState.nodes.filter(n => childNodeIds.indexOf(n.nodeId) >= 0).map(n =>
          predicateNodeReducer(undefined, new InitializePredicateNodeAction(action.domainState, n.nodeId))
        );
      }

      const responseGenerator =
        node.childNodeIdsOrResponseGenerator !== undefined && !Array.isArray(node.childNodeIdsOrResponseGenerator)
          ? node.childNodeIdsOrResponseGenerator
          : undefined;

      return {
        ...state,
        node,
        childNodes,
        responseGenerator,
        isExpanded: childNodes.length > 0, // TODO: remove once devlopment finishes
      };

    case TogglePredicateNodeExpansionAction.TYPE:
      if (action.nodeId !== state.node.nodeId) {
        return state;
      }

      return {
        ...state,
        isExpanded: !state.isExpanded,
      };

    case SelectPredicateNodeAction.TYPE:
      const isSelected = action.nodeId === state.node.nodeId;

      if (isSelected === state.isSelected) {
        return state;
      }

      return {
        ...state,
        isSelected,
      };

    default:
      return state;
  }
}
