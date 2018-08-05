import { callNestedReducers, createArrayReducer } from 'app/infrastructure';

import { domainReducer, DomainState, PredicateNodeUpdatedAction, UpdatePredicateNodeAction } from './domain';
import { InitializePredicateNodeAction, predicateNodeReducer, SelectPredicateNodeAction } from './predicate-node';
import { InitializePredicateNodeDetailsAction, predicateNodeDetailsReducer } from './predicate-node-details';
import { InitializePredicateTreePageAction, PredicateTreePageActions } from './predicate-tree.actions';
import { INITIAL_PREDICATE_TREE_PAGE_STATE, PredicateTreePageState } from './predicate-tree.state';

import { OpenPredicateNodeEditDialogAction, predicateNodeEditDialogReducer } from './predicate-node-edit-dialog';

export function predicateTreePageReducer(
  state = INITIAL_PREDICATE_TREE_PAGE_STATE,
  action: PredicateTreePageActions | UpdatePredicateNodeAction | PredicateNodeUpdatedAction | SelectPredicateNodeAction | OpenPredicateNodeEditDialogAction,
): PredicateTreePageState {
  state = callNestedReducers<PredicateTreePageState>(state, action, {
    domain: domainReducer,
    topLevelNodes: createArrayReducer(predicateNodeReducer),
    nodeDetails: predicateNodeDetailsReducer,
    predicateNodeEditDialog: predicateNodeEditDialogReducer,
  });

  switch (action.type) {
    case InitializePredicateTreePageAction.TYPE:
      const domain: DomainState = {
        nodes: action.dto.nodes,
      };

      const topLevelNodes =
        action.dto.nodes
          .filter(n => n.isTopLevelNode)
          .map(dto => predicateNodeReducer(undefined, new InitializePredicateNodeAction(domain, dto.nodeId)));

      state = {
        ...INITIAL_PREDICATE_TREE_PAGE_STATE,
        domain,
        topLevelNodes,
      };

      return predicateTreePageReducer(state, new SelectPredicateNodeAction(topLevelNodes[0].node.nodeId));

    case UpdatePredicateNodeAction.TYPE:
      return predicateTreePageReducer(state, new PredicateNodeUpdatedAction(state.domain.nodes.find(n => n.nodeId === action.nodeId)!));

    case SelectPredicateNodeAction.TYPE:
      if (state.selectedNodeId === action.nodeId) {
        return state;
      }

      return {
        ...state,
        selectedNodeId: action.nodeId,
        nodeDetails: predicateNodeDetailsReducer(undefined, new InitializePredicateNodeDetailsAction(state.domain, action.nodeId)),
      };

    default:
      return state;
  }
}
