import axios from 'axios';
import { getStoreBuilder } from 'vuex-typex';
import { PredicateNodeDto, PredicateNodeState } from './predicate-node.types';

export interface PredicateNodesState {
  nodeIds: string[];
  nodesById: { [templateId: string]: PredicateNodeState };
}

const b = getStoreBuilder<{}>().module<PredicateNodesState>('predicateNodes', {
  nodeIds: [],
  nodesById: {},
});

export function getAll(state: PredicateNodesState) {
  return state.nodeIds.map(id => state.nodesById[id]);
}

export function addAll(state: PredicateNodesState, nodes: PredicateNodeState[]) {
  nodes.forEach(n => addOrReplace(state, n));
}

export function addOrReplace(state: PredicateNodesState, node: PredicateNodeState) {
  if (!state.nodeIds.includes(node.id)) {
    state.nodeIds.push(node.id);
  }

  state.nodesById[node.id] = node;
}

export async function loadAllAsync() {
  const response = await axios.get<PredicateNodeDto[]>(`/predicate-nodes`);
  predicateTemplates.addAll(response.data);
}

const state$ = b.state();
const getAll$ = b.read(getAll);
const predicateTemplates = {
  get state() { return state$(); },
  get all() { return getAll$(); },

  addAll: b.commit(addAll),

  loadAllAsync: b.dispatch(loadAllAsync),
};

export default predicateTemplates;
