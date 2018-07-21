import {
  NavigationCanceledAction,
  NavigationEndedAction,
  NavigationFailedAction,
  NavigationStartedAction,
  RouterActions,
  RoutesRecognizedAction,
} from './router.actions';
import { INITIAL_ROUTER_STATE, RouterState } from './router.state';

export function routerReducer(state = INITIAL_ROUTER_STATE, action: RouterActions): RouterState {
  switch (action.type) {
    case RoutesRecognizedAction.TYPE:
      return {
        ...state,
        pendingNavigationId: action.navigationId,
      };

    case NavigationStartedAction.TYPE:
      return {
        ...state,
        navigationIsRunning: true,
        pendingNavigation: {
          navigationId: state.pendingNavigationId!,
          ...action.serializedRouterStateSnapshot,
        },
      };

    case NavigationEndedAction.TYPE:
      return {
        ...state,
        ...state.pendingNavigation,
        navigationId: state.pendingNavigationId!,
        navigationIsRunning: false,
        pendingNavigationId: undefined,
        pendingNavigation: undefined,
        history: [
          ...state.history,
          {
            navigationId: state.navigationId,
            url: state.url,
            path: state.path,
            params: state.params,
            queryParams: state.queryParams,
          },
        ],
        navigationResults: [
          ...state.navigationResults,
          {
            result: 'SUCCEEDED',
            ...state.pendingNavigation!,
          },
        ],
      };

    case NavigationCanceledAction.TYPE:
    case NavigationFailedAction.TYPE:
      return {
        ...state,
        navigationIsRunning: false,
        pendingNavigationId: undefined,
        pendingNavigation: undefined,
        navigationResults: [
          ...state.navigationResults,
          {
            result: action.type === NavigationCanceledAction.TYPE ? 'CANCELED' : 'FAILED',
            ...state.pendingNavigation!,
          },
        ],
      };

    default:
      return state;
  }
}
