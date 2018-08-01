import { RootState as AppRootState } from 'app/app.state';

import { PredicateTreePageDto } from './predicate-tree.dto';

import { PredicateNodeState } from './predicate-node';

import { PredicateNodeDetailsState } from './predicate-node-details';

export interface RootState extends AppRootState {
  predicateTree: PredicateTreePageState;
}

export interface PredicateTreePageState extends PredicateTreePageDto {
  topLevelNodes: PredicateNodeState[];
  nodeDetailsByNodeId: {
    [nodeId: string]: PredicateNodeDetailsState;
  };
  selectedNodeId: string | undefined;
}

export const INITIAL_PREDICATE_TREE_PAGE_STATE: PredicateTreePageState = {
  topLevelNodes: [],
  nodeDetailsByNodeId: {},
  selectedNodeId: undefined,
};

export const PREDICATE_TREE_PAGE_STATE_FEATURE_NAME = 'predicateTree';
