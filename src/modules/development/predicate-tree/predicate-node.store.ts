import axios from 'axios';
import { getStoreBuilder } from 'vuex-typex';
import { PredicateNodeDto, PredicateNodeState, RootNodeName } from './predicate-node.types';

export interface PredicateNodesState {
  nodesById: { [templateId: string]: PredicateNodeState };
  nodeIds: string[];
}

const b = getStoreBuilder<{}>().module<PredicateNodesState>('predicateNodes', {
  nodeIds: [],
  nodesById: {},
});

export function getAll(state: PredicateNodesState) {
  return state.nodeIds.map(id => state.nodesById[id]);
}

export function getRootNode(state: PredicateNodesState) {
  const rootNodeName: RootNodeName = 'ROOT';
  return state.nodeIds.map(id => state.nodesById[id]).find(n => n.name === rootNodeName);
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

export function reset(state: PredicateNodesState) {
  state.nodeIds = [];
  state.nodesById = {};
}

export async function loadAllAsync() {
  const response = await axios.get<PredicateNodeDto[]>(`/predicate-tree/nodes`);
  predicateNodes.addAll(response.data);
}

const state$ = b.state();
const getAll$ = b.read(getAll);
const getRootNode$ = b.read(getRootNode);
const predicateNodes = {
  get state() { return state$(); },
  get all() { return getAll$(); },
  get rootNode() { return getRootNode$(); },

  addAll: b.commit(addAll),
  reset: b.commit(reset),

  loadAllAsync: b.dispatch(loadAllAsync),
};

export default predicateNodes;
