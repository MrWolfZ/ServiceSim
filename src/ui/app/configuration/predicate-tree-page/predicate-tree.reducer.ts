import { combineReducers } from '@ngrx/store';

import { callNestedReducers, createArrayReducer } from 'app/infrastructure';

import { InitializePredicateNodeAction, predicateNodeReducer, SelectPredicateNodeAction } from './predicate-node';
import { InitializePredicateNodeDetailsAction, predicateNodeDetailsReducer, PredicateNodeDetailsState } from './predicate-node-details';
import { InitializePredicateTreePageAction, PredicateTreePageActions } from './predicate-tree.actions';
import { INITIAL_PREDICATE_TREE_PAGE_STATE, PredicateTreePageState } from './predicate-tree.state';

export function predicateTreePageReducer(
  state = INITIAL_PREDICATE_TREE_PAGE_STATE,
  action: PredicateTreePageActions | SelectPredicateNodeAction,
): PredicateTreePageState {
  const nodeDetailsByIdReducer = combineReducers<{ [nodeId: string]: PredicateNodeDetailsState }>(
    Object.keys(state.nodeDetailsByNodeId).reduce((agg, nodeId) => ({
      ...agg,
      [nodeId]: predicateNodeDetailsReducer,
    }), {})
  );

  state = callNestedReducers<PredicateTreePageState>(state, action, {
    topLevelNodes: createArrayReducer(predicateNodeReducer),
    nodeDetailsByNodeId: nodeDetailsByIdReducer,
  });

  switch (action.type) {
    case InitializePredicateTreePageAction.TYPE:
      return {
        ...state,
        ...action.dto,
        topLevelNodes: action.dto.topLevelNodes.map((dto, idx) =>
          predicateNodeReducer(state.topLevelNodes[idx], new InitializePredicateNodeAction(dto))
        ),
        nodeDetailsByNodeId:
          Object.keys(action.dto.nodeDetailsByNodeId).reduce((agg, nodeId) => ({
            ...agg,
            [nodeId]: predicateNodeDetailsReducer(
              state.nodeDetailsByNodeId[nodeId],
              new InitializePredicateNodeDetailsAction(action.dto.nodeDetailsByNodeId[nodeId]),
            ),
          }), {}),
      };

    case SelectPredicateNodeAction.TYPE:
      return {
        ...state,
        selectedNodeId: action.nodeId,
      };

    default:
      return state;
  }
}
