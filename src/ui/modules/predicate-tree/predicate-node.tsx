import { page, StatefulComponentContext } from 'src/ui/infrastructure/tsx';
import { Page } from 'src/ui/shared/common-components/page';
import predicateNodes from './predicate-node.store';

export interface PredicateNodeViewState {
  nodeId: string;
}

const initialState: PredicateNodeViewState = {
  nodeId: '',
};

export const PredicateNodePageDef = (state: PredicateNodeViewState, _: StatefulComponentContext) => {
  const { nodeId } = state;
  const node = predicateNodes.state.nodesById[nodeId];

  return (
    <Page title={node.name}>
      TODO
    </Page>
  );
};

export const PredicateNodePage = page(PredicateNodePageDef, initialState, {
  created(state, _, { route }) { state.nodeId = route.params.id; },
  beforeRouteUpdate(state, { params }, _, next) { state.nodeId = params.id; next(); },
});

export default PredicateNodePage;
