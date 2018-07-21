import { Action } from '@ngrx/store';

export class InitializeInfrastructureAction implements Action {
  static readonly TYPE = 'infrastructure/INITIALIZE_INFRASTRUCTURE';
  readonly type = InitializeInfrastructureAction.TYPE;

  constructor(
    public appVersion: string,
  ) { }
}

export class SetPageTitleAction implements Action {
  static readonly TYPE = 'infrastructure/SET_PAGE_TITLE';
  readonly type = SetPageTitleAction.TYPE;

  titleParts: string[];

  constructor(...titleParts: string[]) {
    this.titleParts = titleParts;
  }
}

export class IncrementUiBlockingApiCallSemaphoreAction implements Action {
  static readonly TYPE = 'infrastructure/INCREMENT_UI_BLOCKING_API_SEMAPHORE';
  readonly type = IncrementUiBlockingApiCallSemaphoreAction.TYPE;
}

export class DecrementUiBlockingApiCallSemaphoreAction implements Action {
  static readonly TYPE = 'infrastructure/DECREMENT_UI_BLOCKING_API_SEMAPHORE';
  readonly type = DecrementUiBlockingApiCallSemaphoreAction.TYPE;
}

export class BlockUiAction implements Action {
  static readonly TYPE = 'infrastructure/BLOCK_UI';
  readonly type = BlockUiAction.TYPE;
}

export class UnblockUiAction implements Action {
  static readonly TYPE = 'infrastructure/UNBLOCK_UI';
  readonly type = UnblockUiAction.TYPE;
}

export class ShowInformationMessageAction {
  static readonly TYPE = 'infrastructure/SHOW_INFORMATION_MESSAGE';
  readonly type = ShowInformationMessageAction.TYPE;

  constructor(
    public message: string,
    public action: string = 'OK',
    public duration?: number,
  ) { }
}

export class OpenUrlInNewTabAction implements Action {
  static readonly TYPE = 'infrastructure/OPEN_URL_IN_NEW_TAB';
  readonly type = OpenUrlInNewTabAction.TYPE;

  constructor(
    public url: string,
  ) { }
}

export class ReloadPageAction implements Action {
  static readonly TYPE = 'infrastructure/RELOAD_PAGE';
  readonly type = ReloadPageAction.TYPE;
}

export type InfrastructureActions =
  | InitializeInfrastructureAction
  | SetPageTitleAction
  | IncrementUiBlockingApiCallSemaphoreAction
  | DecrementUiBlockingApiCallSemaphoreAction
  | BlockUiAction
  | UnblockUiAction
  | OpenUrlInNewTabAction
  | ShowInformationMessageAction
  | ReloadPageAction
  ;
