export interface ErrorPageState {
  apiError: ApiError | undefined;
}

export const INITIAL_ERROR_PAGE_STATE: ErrorPageState = {
  apiError: undefined,
};

export interface ApiError {
  stackTrace?: string;
  message: string;
  timeOfErrorEpoch: number;
}
