import { Action } from '@ngrx/store';

export class AppLoadedAction implements Action {
  static readonly TYPE = 'app/APP_LOADED';
  readonly type = AppLoadedAction.TYPE;

  constructor(
    public appName: string,
  ) {}
}

export class AppInitializedAction implements Action {
  static readonly TYPE = 'app/INITIALIZED';
  readonly type = AppInitializedAction.TYPE;
}

export class LoadAppDataAction implements Action {
  static readonly TYPE = 'app/LOAD_APPDATA';
  readonly type = LoadAppDataAction.TYPE;
}

export type AppActions =
  | AppLoadedAction
  | AppInitializedAction
  | LoadAppDataAction
  ;
