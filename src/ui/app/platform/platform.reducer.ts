import { errorPageReducer } from './error-page';
import { loadingBarReducer } from './loading-bar';
import {
  DecrementUiBlockingApiCallSemaphoreAction,
  IncrementUiBlockingApiCallSemaphoreAction,
  InitializePlatformAction,
  PlatformActions,
  SetPageTitleAction,
} from './platform.actions';
import { INITIAL_PLATFORM_STATE, PlatformState } from './platform.state';
import { callNestedReducers } from './util';

export function platformReducer(state = INITIAL_PLATFORM_STATE, action: PlatformActions): PlatformState {
  state = callNestedReducers(state, action, {
    errorPage: errorPageReducer,
    loadingBar: loadingBarReducer,
  });

  switch (action.type) {
    case InitializePlatformAction.TYPE:
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
