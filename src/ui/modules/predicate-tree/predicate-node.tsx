import { stateful, StatefulComponentContext } from 'src/ui/infrastructure/tsx';
import { ExpansionContainer } from 'src/ui/shared/expansion-container';
import { Location } from 'vue-router';
import { RecordPropsDefinition } from 'vue/types/options';
import './predicate-node.scss';
import predicateNodes from './predicate-node.store';

export interface PredicateNodeViewProps {
  nodeId: string;
  isFocused: boolean;
}

const propsDefinition: RecordPropsDefinition<PredicateNodeViewProps> = {
  nodeId: {},
  isFocused: {},
};

export interface PredicateNodeViewState {
  isExpanded: boolean;
}

const initialState: PredicateNodeViewState = {
  isExpanded: true,
};

export const PredicateNodeViewDef = (state: PredicateNodeViewState, { nodeId, isFocused }: PredicateNodeViewProps, { router }: StatefulComponentContext) => {
  const { isExpanded } = state;
  const node = predicateNodes.state.nodesById[nodeId];

  return (
    // isDisabled => opacity: 0.3
    <div
      class='predicate-node-view'
      style={{ marginTop: isFocused ? 0 : '1.5rem' }}
      on-dblclick={(e: Event) => { router.push({ name: 'predicate-tree', params: { focusedNodeId: nodeId } }); e.stopPropagation(); }}
    >
      <div
        class='box flex-column flex-center'
        style={{ padding: '0.75rem', position: 'relative', margin: 0 }}
      >
        <div class='flex-row flex-center'>
          {renderExpansionToggleTrigger()}
          {renderName(node.name, isFocused ? undefined : { name: 'predicate-tree', params: { focusedNodeId: nodeId } })}
          {renderDescription(node.description)}
        </div>

        {renderResponseGeneratorPart()}
      </div>

      {renderChildNodes()}
    </div>
  );

  function renderExpansionToggleTrigger() {
    const childNodeIds = Array.isArray(node.childNodeIdsOrResponseGenerator) ? node.childNodeIdsOrResponseGenerator : [];
    const isExpandable = !isFocused && childNodeIds.length > 0;

    const style = {
      cursor: isExpandable ? 'pointer' : undefined,
      opacity: isExpandable ? undefined : 0,
    };

    const iconStyle = {
      transform: isExpanded ? 'rotate(90deg)' : undefined,
      userSelect: 'none',
      transition: 'transform ease 200ms',
    };

    return (
      <div
        class='icon'
        style={style}
        onClick={(e: Event) => { state.isExpanded = !isExpanded; e.stopPropagation(); }}
      >
        <fa-icon style={iconStyle} icon='chevron-right' />
      </div>
    );
  }

  function renderResponseGeneratorPart() {
    const responseGenerator = !Array.isArray(node.childNodeIdsOrResponseGenerator) ? node.childNodeIdsOrResponseGenerator : undefined;

    if (!responseGenerator) {
      return null;
    }

    return (
      <div class='flex-row flex-center'>
        <div class='icon'>
          <fa-icon icon='arrow-left' />
        </div>

        {renderName(responseGenerator.name)}
        {renderDescription(responseGenerator.description)}

      </div>
    );
  }

  function renderChildNodes() {
    const childNodeIds = Array.isArray(node.childNodeIdsOrResponseGenerator) ? node.childNodeIdsOrResponseGenerator : [];

    return (
      <ExpansionContainer isExpanded={isExpanded}>
        <div style={{ paddingLeft: '2.5em' }} class='child-nodes'>
          {
            childNodeIds.map(id =>
              <PredicateNodeView
                key={id}
                nodeId={id}
                isFocused={false}
              />
            )
          }
        </div>
      </ExpansionContainer>
    );
  }

  function renderName(name: string, link?: Location) {
    return (
      <div class='flex-row flex-center' style={{ minWidth: '120px', marginRight: '2em' }}>
        <h3 class='is-size-5' style={{ whiteSpace: 'nowrap', marginLeft: '0.2em' }}>
          {!link ? name : <router-link to={link}>{name}</router-link>}
        </h3>
      </div>
    );
  }

  function renderDescription(description: string) {
    return (
      <div
        style={{
          marginRight: '2em',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        <i>{description || 'No description'}</i>
      </div>
    );
  }
};

export const PredicateNodeView = stateful(PredicateNodeViewDef, initialState, propsDefinition, {
  created(state, { isFocused }) { state.isExpanded = isFocused; },
});
