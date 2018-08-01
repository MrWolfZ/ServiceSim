import { createFormControlState, FormControlState } from 'ngrx-forms';

import { RootState as AppRootState } from 'app/app.state';

import { PredicateKindsPageDto } from './predicate-kinds.dto';

import { PredicateKindTileState } from './predicate-kind-tile';

import { PredicateKindDialogState } from './predicate-kind-dialog';

export interface RootState extends AppRootState {
  predicateKinds: PredicateKindsPageState;
}

export interface PredicateKindsPageState extends PredicateKindsPageDto {
  tiles: PredicateKindTileState[];
  dialog: PredicateKindDialogState;
  filterControl: FormControlState<string>;
}

export const INITIAL_PREDICATE_KINDS_PAGE_STATE: PredicateKindsPageState = {
  tiles: [],
  dialog: undefined!,
  filterControl: createFormControlState('configuration/predicate-kinds-page/FILTER_CONTROL', ''),
};

export const PREDICATE_KINDS_PAGE_STATE_FEATURE_NAME = 'predicateKinds';
