import { RootState as AppRootState } from 'app/app.state';

import { PredicateTreePageDto } from './predicate-tree.dto';

import { PredicateNodeState } from './predicate-node';

export interface RootState extends AppRootState {
  predicateTree: PredicateTreePageState;
}

export interface PredicateTreePageState extends PredicateTreePageDto {
  topLevelNodes: PredicateNodeState[];
}

export const INITIAL_PREDICATE_TREE_PAGE_STATE: PredicateTreePageState = {
  topLevelNodes: [],
};

export const PREDICATE_TREE_PAGE_STATE_FEATURE_NAME = 'predicateTree';
