import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ROOT_NODE_NAME } from 'src/domain/predicate-tree';
import { stateful } from 'src/ui/infrastructure/stateful-component';
import { PrimaryButton } from 'src/ui/shared/common-components/button';
import { Page } from 'src/ui/shared/common-components/layout/page';
import { routeParams$ } from 'src/ui/shared/routing';
import predicateNodes, { PredicateNodeState } from './predicate-node.store';
import { PredicateTreeNode } from './predicate-tree-node';

interface PredicateTreePageProps {
  focusedNodeId: Observable<string | undefined>;
  nodesById: Observable<Dictionary<PredicateNodeState>>;
  rootNode: Observable<PredicateNodeState>;
}

export const PredicateTreePage = stateful<{}, PredicateTreePageProps>(
  {},
  {
    focusedNodeId: routeParams$.pipe(map(p => p.focusedNodeId)),
    nodesById: of(predicateNodes.state.nodesById),
    rootNode: of(predicateNodes.rootNode),
  },
  function PredicateTreePage({ focusedNodeId, nodesById, rootNode }) {
    const focusedNode = focusedNodeId ? nodesById[focusedNodeId] : rootNode;

    const parentNodeChain: { id: string; name: string }[] = [];

    let parentNodeId = focusedNode.parentNodeId;
    while (!!parentNodeId) {
      const parentNode = nodesById[parentNodeId];
      parentNodeId = parentNode.parentNodeId;

      parentNodeChain.unshift({ id: parentNode.id, name: parentNode.name });
    }

    return (
      <Page title='Predicate Tree'>

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
          <PredicateTreeNode
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
              onClick={() => /* router.push({ name: 'TODO' }) */ { }}
            />
          </div>
        }

      </Page>
    );
  },
);

export default PredicateTreePage;
