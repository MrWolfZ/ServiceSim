import { getAllPredicateNodes, PredicateNodeDto } from 'src/application/predicate-tree/queries/get-all-predicate-nodes';
import { ROOT_NODE_NAME } from 'src/domain/predicate-tree';
import { getStoreBuilder } from 'vuex-typex';

export interface PredicateNodeState extends PredicateNodeDto {
  parentNodeId: string | undefined;
}

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
  return state.nodeIds.map(id => state.nodesById[id]).find(n => n.name === ROOT_NODE_NAME)!;
}

export function addAll(state: PredicateNodesState, nodes: PredicateNodeDto[]) {
  const childIdToParentId = {} as { [childNodeId: string]: string };
  nodes
    .filter(n => Array.isArray(n.childNodeIdsOrResponseGenerator))
    .forEach(n => (n.childNodeIdsOrResponseGenerator as string[]).forEach(childId => childIdToParentId[childId] = n.id));

  nodes.forEach(n => addOrReplace(state, { ...n, parentNodeId: childIdToParentId[n.id] }));
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
  const response = await getAllPredicateNodes({});

  predicateNodes.addAll(response);
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
