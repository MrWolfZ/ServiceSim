import { DecrementLoadingBarSemaphoreAction, IncrementLoadingBarSemaphoreAction, LoadingBarActions } from './loading-bar.actions';
import { INITIAL_LOADING_BAR_STATE, LoadingBarState } from './loading-bar.state';

export function loadingBarReducer(state = INITIAL_LOADING_BAR_STATE, action: LoadingBarActions): LoadingBarState {
  switch (action.type) {
    case IncrementLoadingBarSemaphoreAction.TYPE:
      return { ...state, activationSemaphore: state.activationSemaphore + 1 };

    case DecrementLoadingBarSemaphoreAction.TYPE:
      return { ...state, activationSemaphore: state.activationSemaphore - 1 };

    default: {
      return state;
    }
  }
}
