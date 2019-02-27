import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { stateful } from 'src/ui/infrastructure/stateful-component';
import { Page } from 'src/ui/shared/common-components/page';
import { routeParams$ } from 'src/ui/shared/routing';
import predicateNodes, { PredicateNodeState } from './predicate-node.store';

export interface PredicateNodeViewProps {
  nodeId: Observable<string>;
  nodesById: Observable<Dictionary<PredicateNodeState>>;
}

export interface PredicateNodeViewState {
  nodeId: string;
}

const initialState: PredicateNodeViewState = {
  nodeId: '',
};

export const PredicateNodePage = stateful<PredicateNodeViewState, PredicateNodeViewProps>(
  initialState,
  {
    nodeId: routeParams$.pipe(map(p => p.id)),
    nodesById: of(predicateNodes.state.nodesById),
  },
  function PredicateNodePage({ nodeId, nodesById }) {
    const node = nodesById[nodeId];

    return (
      <Page title={node.name}>
        TODO
    </Page>
    );
  },
);

export default PredicateNodePage;
