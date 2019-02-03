import { ROOT_NODE_NAME } from 'src/domain/predicate-tree';
import { page, StatefulComponentContext } from 'src/ui/infrastructure/tsx';
import { PrimaryButton } from 'src/ui/shared/common-components/button';
import { PredicateNodeView } from './predicate-node';
import predicateNodes from './predicate-node.store';

interface PredicateTreePageState {
  focusedNodeId: string | undefined;
}

const initialState: PredicateTreePageState = {
  focusedNodeId: undefined,
};

export const PredicateTreePageDef = (
  state: PredicateTreePageState,
  { router }: StatefulComponentContext,
) => {
  const { focusedNodeId } = state;

  const focusedNode = focusedNodeId ? predicateNodes.state.nodesById[focusedNodeId] : predicateNodes.rootNode;

  const parentNodeChain: { id: string; name: string }[] = [];

  let parentNodeId = focusedNode.parentNodeId;
  while (!!parentNodeId) {
    const parentNode = predicateNodes.state.nodesById[parentNodeId];
    parentNodeId = parentNode.parentNodeId;

    parentNodeChain.unshift({ id: parentNode.id, name: parentNode.name });
  }

  return (
    <div class='page flex-column'>
      <h1 class='title'>
        Predicate Tree
      </h1>

      <nav class='breadcrumb' aria-label='breadcrumbs'>
        <ul>
          {
            parentNodeChain.map(({ id, name }) =>
              <li key={id}>
                <router-link to={{ name: 'predicate-tree', params: { focusedNodeId: name === ROOT_NODE_NAME ? undefined : id } }}>{name}</router-link>
              </li>
            )
          }
          <li class='is-active'><a href='#' aria-current='page'>{focusedNode.name}</a></li>
        </ul>
      </nav>

      <div class='flex-fill'>
        <PredicateNodeView
          class='node'
          nodeId={focusedNode.id}
          isFocused={true}
        />
      </div>

      {false &&
        <div>
          <p>There are no predicate nodes yet.</p>
          <br />

          <PrimaryButton
            label='Create new node'
            icon='plus'
            onClick={() => router.push({ name: 'TODO' })}
          />
        </div>
      }
    </div>
  );
};

export const PredicateTreePage = page(PredicateTreePageDef, initialState, {
  created: (state, _, { route }) => state.focusedNodeId = route.params.focusedNodeId,

  beforeRouteUpdate: (state, to, _, next) => {
    state.focusedNodeId = to.params.focusedNodeId;
    next();
  },
});

export default PredicateTreePage;
