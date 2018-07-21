import { errorPageReducer } from './error-page';
import {
  DecrementUiBlockingApiCallSemaphoreAction,
  IncrementUiBlockingApiCallSemaphoreAction,
  InfrastructureActions,
  InitializeInfrastructureAction,
  SetPageTitleAction,
} from './infrastructure.actions';
import { InfrastructureState, INITIAL_INFRASTRUCTURE_STATE } from './infrastructure.state';
import { loadingBarReducer } from './loading-bar';
import { callNestedReducers } from './util';

export function infrastructureReducer(state = INITIAL_INFRASTRUCTURE_STATE, action: InfrastructureActions): InfrastructureState {
  state = callNestedReducers(state, action, {
    errorPage: errorPageReducer,
    loadingBar: loadingBarReducer,
  });

  switch (action.type) {
    case InitializeInfrastructureAction.TYPE:
      return {
        ...state,
        isInitialized: true,
        appVersion: action.appVersion,
      };

    case SetPageTitleAction.TYPE:
      return {
        ...state,
        pageTitle: [...action.titleParts, 'Service Simulator'].join(' | '),
      };

    case IncrementUiBlockingApiCallSemaphoreAction.TYPE: {
      const uiBlockingSemaphore = state.uiBlockingSemaphore + 1;

      return {
        ...state,
        uiBlockingSemaphore,
        uiIsBlocked: true,
      };
    }

    case DecrementUiBlockingApiCallSemaphoreAction.TYPE: {
      const uiBlockingSemaphore = state.uiBlockingSemaphore - 1;

      return {
        ...state,
        uiBlockingSemaphore,
        uiIsBlocked: uiBlockingSemaphore > 0,
      };
    }

    default: {
      return state;
    }
  }
}
