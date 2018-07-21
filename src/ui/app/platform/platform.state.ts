import { ErrorPageState } from './error-page';
import { LoadingBarState } from './loading-bar';
import { RouterState } from './router';

export interface RootState {
  platform: PlatformState;
  router: RouterState;
}

export interface PlatformState {
  errorPage: ErrorPageState;
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

export const INITIAL_PLATFORM_STATE: PlatformState = {
  errorPage: undefined!,
  loadingBar: undefined!,
  isInitialized: false,
  appVersion: '',
  pageTitle: '',
  uiBlockingSemaphore: 0,
  uiIsBlocked: false,
};
