import { Action } from '@ngrx/store';

// this is used to toggle the menu on mobile devices; on other
// devices the menu should always be visible
export class ToggleMenuAction implements Action {
  static readonly TYPE = 'infrastructure/navbar/TOGGLE_MENU';
  readonly type = ToggleMenuAction.TYPE;
}

export class CloseMenuAction implements Action {
  static readonly TYPE = 'infrastructure/navbar/CLOSE_MENU';
  readonly type = CloseMenuAction.TYPE;
}

export type NavbarActions =
  | ToggleMenuAction
  | CloseMenuAction
  ;
