import { Action } from '@ngrx/store';

export class InitializePlatformAction implements Action {
  static readonly TYPE = 'platform/INITIALIZE_PLATFORM';
  readonly type = InitializePlatformAction.TYPE;

  constructor(
    public appVersion: string,
  ) { }
}

export class SetPageTitleAction implements Action {
  static readonly TYPE = 'platform/SET_PAGE_TITLE';
  readonly type = SetPageTitleAction.TYPE;

  titleParts: string[];

  constructor(...titleParts: string[]) {
    this.titleParts = titleParts;
  }
}

export class IncrementUiBlockingApiCallSemaphoreAction implements Action {
  static readonly TYPE = 'platform/INCREMENT_UI_BLOCKING_API_SEMAPHORE';
  readonly type = IncrementUiBlockingApiCallSemaphoreAction.TYPE;
}

export class DecrementUiBlockingApiCallSemaphoreAction implements Action {
  static readonly TYPE = 'platform/DECREMENT_UI_BLOCKING_API_SEMAPHORE';
  readonly type = DecrementUiBlockingApiCallSemaphoreAction.TYPE;
}

export class BlockUiAction implements Action {
  static readonly TYPE = 'platform/BLOCK_UI';
  readonly type = BlockUiAction.TYPE;
}

export class UnblockUiAction implements Action {
  static readonly TYPE = 'platform/UNBLOCK_UI';
  readonly type = UnblockUiAction.TYPE;
}

export class ShowInformationMessageAction {
  static readonly TYPE = 'platform/SHOW_INFORMATION_MESSAGE';
  readonly type = ShowInformationMessageAction.TYPE;

  constructor(
    public message: string,
    public action: string = 'OK',
    public duration?: number,
  ) { }
}

export class OpenUrlInNewTabAction implements Action {
  static readonly TYPE = 'platform/OPEN_URL_IN_NEW_TAB';
  readonly type = OpenUrlInNewTabAction.TYPE;

  constructor(
    public url: string,
  ) { }
}

export class ReloadPageAction implements Action {
  static readonly TYPE = 'platform/RELOAD_PAGE';
  readonly type = ReloadPageAction.TYPE;
}

export type PlatformActions =
  | InitializePlatformAction
  | SetPageTitleAction
  | IncrementUiBlockingApiCallSemaphoreAction
  | DecrementUiBlockingApiCallSemaphoreAction
  | BlockUiAction
  | UnblockUiAction
  | OpenUrlInNewTabAction
  | ShowInformationMessageAction
  | ReloadPageAction
  ;
