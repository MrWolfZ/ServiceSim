import { RootState as AppRootState } from 'app/app.state';

import { PredicateKindListDto, PredicateKindListState } from './predicate-kind-list';

export interface RootState extends AppRootState {
  predicateKinds: PredicateKindsPageState;
}

export interface PredicateKindsPageDto {
  predicateKindList: PredicateKindListDto;
}

export interface PredicateKindsPageState extends PredicateKindsPageDto {
  predicateKindList: PredicateKindListState;
}

export const INITIAL_PREDICATE_KINDS_PAGE_STATE: PredicateKindsPageState = {
  predicateKindList: undefined!,
};

export const PREDICATE_KINDS_PAGE_STATE_FEATURE_NAME = 'predicateKinds';
