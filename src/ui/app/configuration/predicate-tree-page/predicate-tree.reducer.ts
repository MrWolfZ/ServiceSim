import { callNestedReducers, createArrayReducer } from 'app/infrastructure';

import { domainReducer, DomainState } from './domain';
import { InitializePredicateNodeAction, predicateNodeReducer, SelectPredicateNodeAction } from './predicate-node';
import { InitializePredicateNodeDetailsAction, predicateNodeDetailsReducer } from './predicate-node-details';
import { InitializePredicateTreePageAction, PredicateTreePageActions } from './predicate-tree.actions';
import { INITIAL_PREDICATE_TREE_PAGE_STATE, PredicateTreePageState } from './predicate-tree.state';

export function predicateTreePageReducer(
  state = INITIAL_PREDICATE_TREE_PAGE_STATE,
  action: PredicateTreePageActions | SelectPredicateNodeAction,
): PredicateTreePageState {
  state = callNestedReducers<PredicateTreePageState>(state, action, {
    domain: domainReducer,
    topLevelNodes: createArrayReducer(predicateNodeReducer),
    nodeDetails: predicateNodeDetailsReducer,
  });

  switch (action.type) {
    case InitializePredicateTreePageAction.TYPE:
      const domain: DomainState = {
        nodes: action.dto.nodes,
      };

      return {
        ...INITIAL_PREDICATE_TREE_PAGE_STATE,
        domain,
        topLevelNodes: action.dto.nodes.filter(n => n.isTopLevelNode).map(dto =>
          predicateNodeReducer(undefined, new InitializePredicateNodeAction(domain, dto.nodeId))
        ),
      };

    case SelectPredicateNodeAction.TYPE:
      return {
        ...state,
        selectedNodeId: action.nodeId,
        nodeDetails: predicateNodeDetailsReducer(undefined, new InitializePredicateNodeDetailsAction(state.domain, action.nodeId)),
      };

    default:
      return state;
  }
}
