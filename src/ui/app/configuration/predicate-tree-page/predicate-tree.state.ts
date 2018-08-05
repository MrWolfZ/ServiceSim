import { RootState as AppRootState } from 'app/app.state';

import { DomainState } from './domain';
import { PredicateNodeState } from './predicate-node';
import { PredicateNodeDetailsState } from './predicate-node-details';

import { PredicateNodeEditDialogState } from './predicate-node-edit-dialog';

export interface RootState extends AppRootState {
  predicateTree: PredicateTreePageState;
}

export interface PredicateTreePageState {
  domain: DomainState;
  topLevelNodes: PredicateNodeState[];
  nodeDetails: PredicateNodeDetailsState;
  selectedNodeId: string | undefined;
  predicateNodeEditDialog: PredicateNodeEditDialogState;
}

export const INITIAL_PREDICATE_TREE_PAGE_STATE: PredicateTreePageState = {
  domain: undefined!,
  topLevelNodes: [],
  nodeDetails: undefined!,
  selectedNodeId: undefined,
  predicateNodeEditDialog: undefined!,
};

export const PREDICATE_TREE_PAGE_STATE_FEATURE_NAME = 'predicateTree';
