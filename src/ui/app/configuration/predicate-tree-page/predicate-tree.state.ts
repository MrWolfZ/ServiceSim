import { RootState as AppRootState } from 'app/app.state';

import { PredicateTreePageDto } from './predicate-tree.dto';

export interface RootState extends AppRootState {
  predicateTree: PredicateTreePageState;
}

export interface PredicateTreePageState extends PredicateTreePageDto {

}

export const INITIAL_PREDICATE_TREE_PAGE_STATE: PredicateTreePageState = {

};

export const PREDICATE_TREE_PAGE_STATE_FEATURE_NAME = 'predicateTree';
