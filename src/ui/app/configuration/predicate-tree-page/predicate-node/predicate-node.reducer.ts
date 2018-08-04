import { InitializePredicateNodeAction, PredicateNodeActions, SelectPredicateNodeAction, TogglePredicateNodeExpansionAction } from './predicate-node.actions';
import { INITIAL_PREDICATE_NODE_STATE, PredicateNodeState } from './predicate-node.state';

import { callNestedReducers, createArrayReducer } from 'app/infrastructure';

export function predicateNodeReducer(state = INITIAL_PREDICATE_NODE_STATE, action: PredicateNodeActions): PredicateNodeState {
  // we do not forward initialization actions to our child nodes since they are explicitly
  // intialized in the intialization handler below
  if (action.type !== InitializePredicateNodeAction.TYPE) {
    state = callNestedReducers<PredicateNodeState>(state, action, {
      childNodes: createArrayReducer(predicateNodeReducer),
    });
  }

  switch (action.type) {
    case InitializePredicateNodeAction.TYPE:
      return {
        ...state,
        ...action.dto,
        childNodes: action.dto.childNodes.map(dto =>
          predicateNodeReducer(state.childNodes.find(n => n.nodeId === dto.nodeId), new InitializePredicateNodeAction(dto))
        ),
        isExpanded: action.dto.childNodes.length > 0, // TODO: remove once devlopment finishes
      };

    case TogglePredicateNodeExpansionAction.TYPE:
      if (action.nodeId !== state.nodeId) {
        return state;
      }

      return {
        ...state,
        isExpanded: !state.isExpanded,
      };

    case SelectPredicateNodeAction.TYPE:
      const isSelected = action.nodeId === state.nodeId;

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
