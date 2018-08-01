import { ErrorPageState } from './error-page';
import { LoadingBarState } from './loading-bar';
import { NavbarState } from './navbar';
import { RouterState } from './router';

export interface RootState {
  infrastructure: InfrastructureState;
  router: RouterState;
}

export interface InfrastructureState {
  errorPage: ErrorPageState;
  navbar: NavbarState;
  loadingBar: LoadingBarState;
  // this property is used to track whether the application has been initialized already (e.g. through)
  // the normal ngrx store lifecycle or by being rehydrated; this allows the application to react differently
  // if the app is e.g. being rehydrated
  isInitialized: boolean;
  appVersion: string;
  pageTitle: string;
  uiBlockingSemaphore: number;
  uiIsBlocked: boolean;
}

export const INITIAL_INFRASTRUCTURE_STATE: InfrastructureState = {
  errorPage: undefined!,
  navbar: undefined!,
  loadingBar: undefined!,
  isInitialized: false,
  appVersion: '',
  pageTitle: '',
  uiBlockingSemaphore: 0,
  uiIsBlocked: false,
};
