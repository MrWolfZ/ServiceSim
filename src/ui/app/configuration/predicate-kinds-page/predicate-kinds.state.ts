import { RootState as AppRootState } from 'app/app.state';

export interface RootState extends AppRootState {
  predicateKinds: PredicateKindsPageState;
}

export interface PredicateKindsPageDto {

}

export interface PredicateKindsPageState extends PredicateKindsPageDto {

}

export const INITIAL_PREDICATE_KINDS_PAGE_STATE: PredicateKindsPageState = {

};

export const PREDICATE_KINDS_PAGE_STATE_FEATURE_NAME = 'predicateKinds';
