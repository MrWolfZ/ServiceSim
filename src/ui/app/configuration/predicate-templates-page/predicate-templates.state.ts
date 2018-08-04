import { createFormControlState, FormControlState } from 'ngrx-forms';

import { RootState as AppRootState } from 'app/app.state';

import { PredicateTemplateDialogState } from './predicate-template-dialog';
import { PredicateTemplateTileState } from './predicate-template-tile';
import { PredicateTemplatesPageDto } from './predicate-templates.dto';

export interface RootState extends AppRootState {
  predicateTemplatesPage: PredicateTemplatesPageState;
}

export interface PredicateTemplatesPageState extends PredicateTemplatesPageDto {
  tiles: PredicateTemplateTileState[];
  dialog: PredicateTemplateDialogState;
  filterControl: FormControlState<string>;
}

export const INITIAL_PREDICATE_TEMPLATES_PAGE_STATE: PredicateTemplatesPageState = {
  tiles: [],
  dialog: undefined!,
  filterControl: createFormControlState('configuration/predicate-templates-page/FILTER_CONTROL', ''),
};

export const PREDICATE_TEMPLATES_PAGE_STATE_FEATURE_NAME = 'predicateTemplatesPage';
