export interface LoadingBarState {
  activationSemaphore: number;
}

export const INITIAL_LOADING_BAR_STATE: LoadingBarState = {
  activationSemaphore: 0,
};
