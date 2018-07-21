import { ActionReducerMap } from '@ngrx/store';
import { environment } from 'environments/environment';

/**
 * storeFreeze prevents state from being mutated. When mutation occurs, an
 * exception will be thrown. This is useful during development mode to
 * ensure that none of the reducers accidentally mutates the state.
 */
import { storeFreeze } from 'ngrx-store-freeze';

import { RootState } from './app.state';
import { infrastructureReducer, routerReducer } from './infrastructure';

export const reducers: ActionReducerMap<RootState, any> = {
  infrastructure: infrastructureReducer,
  router: routerReducer,
};

export const metaReducers = [
  ...environment.enableStoreFreeze ? [storeFreeze] : [],
];
