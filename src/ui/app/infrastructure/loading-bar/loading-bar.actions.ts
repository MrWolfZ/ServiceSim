import { Action } from '@ngrx/store';

export class IncrementLoadingBarSemaphoreAction implements Action {
  static readonly TYPE = 'infrastructure/loading-bar/INCREMENT_LOADING_BAR_SEMAPHORE';
  readonly type = IncrementLoadingBarSemaphoreAction.TYPE;
}

export class DecrementLoadingBarSemaphoreAction implements Action {
  static readonly TYPE = 'infrastructure/loading-bar/DECREMENT_LOADING_BAR_SEMAPHORE';
  readonly type = DecrementLoadingBarSemaphoreAction.TYPE;
}

export type LoadingBarActions =
  | IncrementLoadingBarSemaphoreAction
  | DecrementLoadingBarSemaphoreAction
  ;
