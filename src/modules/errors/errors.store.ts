import { getStoreBuilder } from 'vuex-typex';

export interface ApiError {
  message: string;
}

export interface ErrorsState {
  apiError: ApiError | undefined;
}

const b = getStoreBuilder<{}>().module<ErrorsState>('errors', {
  apiError: undefined,
});

export function setError(state: ErrorsState, error: ApiError) {
  state.apiError = error;
}

export function clearError(state: ErrorsState) {
  state.apiError = undefined;
}

const state$ = b.state();
const errors = {
  get state() { return state$(); },

  setError: b.commit(setError),
  clearError: b.commit(clearError),
};

export default errors;
