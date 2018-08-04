import { createFormControlState, FormControlState } from 'ngrx-forms';

import { RootState as AppRootState } from 'app/app.state';

import { PredicateTemplateDialogState } from './predicate-kind-dialog';
import { PredicateKindTileState } from './predicate-kind-tile';
import { PredicateKindsPageDto } from './predicate-kinds.dto';

export interface RootState extends AppRootState {
  predicateKinds: PredicateKindsPageState;
}

export interface PredicateKindsPageState extends PredicateKindsPageDto {
  tiles: PredicateKindTileState[];
  dialog: PredicateTemplateDialogState;
  filterControl: FormControlState<string>;
}

export const INITIAL_PREDICATE_KINDS_PAGE_STATE: PredicateKindsPageState = {
  tiles: [],
  dialog: undefined!,
  filterControl: createFormControlState('configuration/predicate-kinds-page/FILTER_CONTROL', ''),
};

export const PREDICATE_KINDS_PAGE_STATE_FEATURE_NAME = 'predicateKinds';
