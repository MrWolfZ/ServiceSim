import { Observable, of } from 'rxjs';
import { stateful } from 'src/ui/infrastructure/stateful-component';
import { ExpansionContainer } from 'src/ui/shared/expansion-container';
import { navigateToPredicateTree } from 'src/ui/shared/routing';
import { Location } from 'vue-router';
import predicateNodes, { PredicateNodeState } from './predicate-node.store';
import './predicate-tree-node.scss';

export interface PredicateTreeNodeProps {
  nodesById: Observable<{ [templateId: string]: PredicateNodeState }>;
  nodeId: string;
  isFocused: boolean;
}

export interface PredicateTreeNodeState {
  isExpanded: boolean;
}

const initialState: PredicateTreeNodeState = {
  isExpanded: true,
};

export const PredicateTreeNode = stateful<PredicateTreeNodeState, PredicateTreeNodeProps>(
  initialState,
  { nodesById: of(predicateNodes.state.nodesById) },
  function PredicateTreeNodeDef({ isExpanded, nodesById, nodeId, isFocused, setState }) {
    if (!nodesById) {
      return null;
    }

    const node = nodesById[nodeId];

    return (
      // isDisabled => opacity: 0.3
      <div style={{ marginTop: isFocused ? 0 : '1.5rem' }} on-dblclick={onDoubleClick}>
        <div
          class='box flex-column flex-center-alt'
          style={{ padding: '0.75rem', position: 'relative', margin: 0 }}
        >
          <div class='flex-row flex-center-alt'>
            {renderExpansionToggleTrigger()}
            {renderName(node.name, { name: 'predicate-node', params: { id: nodeId } })}
            {renderDescription(node.description)}
          </div>

          {renderResponseGeneratorPart()}
        </div>

        {renderChildNodes()}
      </div>
    );

    async function onDoubleClick(event: Event) {
      if (isFocused) {
        return;
      }

      event.stopPropagation();
      await navigateToPredicateTree(nodeId);
    }

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
          onClick={(e: Event) => { setState(s => ({ ...s, isExpanded: !s.isExpanded })); e.stopPropagation(); }}
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
        <div class='flex-row flex-center-alt'>
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
                <PredicateTreeNode
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
        <div class='flex-row flex-center-alt' style={{ minWidth: '120px', marginRight: '2em' }}>
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
  },
  {
    created({ isFocused, setState }) { setState(s => ({ ...s, isExpanded: isFocused })); },
  },
);
