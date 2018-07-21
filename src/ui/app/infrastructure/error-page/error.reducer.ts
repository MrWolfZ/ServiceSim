import { ClearApiErrorAction, ErrorPageActions, SetApiErrorAction } from './error.actions';
import { ErrorPageState, INITIAL_ERROR_PAGE_STATE } from './error.state';

export function errorPageReducer(state = INITIAL_ERROR_PAGE_STATE, action: ErrorPageActions): ErrorPageState {
  switch (action.type) {
    case SetApiErrorAction.TYPE:
      return {
        ...state,
        apiError: action.apiError,
      };

    case ClearApiErrorAction.TYPE:
      return {
        ...state,
        apiError: undefined,
      };

    default: {
      return state;
    }
  }
}
