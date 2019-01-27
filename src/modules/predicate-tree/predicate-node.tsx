import { Component, Prop } from 'vue-property-decorator';
import { Emit, ExpansionContainer, TsxComponent } from '../../ui-infrastructure';
import './predicate-node.scss';
import predicateNodes from './predicate-node.store';

export interface PredicateNodeViewProps {
  nodeId: string;
  selectedNodeId: string;
  onSelect: (nodeId: string) => any;
}

@Component({})
export class PredicateNodeView extends TsxComponent<PredicateNodeViewProps> implements PredicateNodeViewProps {
  @Prop() nodeId: string;
  @Prop() selectedNodeId: string;

  @Emit()
  onSelect(_: string) { }

  private isExpanded = true;

  private get node() {
    return predicateNodes.state.nodesById[this.nodeId];
  }

  private get childNodeIds() {
    return Array.isArray(this.node.childNodeIdsOrResponseGenerator) ? this.node.childNodeIdsOrResponseGenerator : [];
  }

  private get templateInfo() {
    return typeof this.node.templateInfoOrEvalFunctionBody !== 'string' ? this.node.templateInfoOrEvalFunctionBody : undefined;
  }

  private get parameterNames() {
    return this.templateInfo ? this.templateInfo.templateDataSnapshot.parameters.map(p => p.name) : [];
  }

  private get responseGenerator() {
    return !Array.isArray(this.node.childNodeIdsOrResponseGenerator) ? this.node.childNodeIdsOrResponseGenerator : undefined;
  }

  private get responseGeneratorTemplateInfo() {
    return this.responseGenerator && typeof this.responseGenerator.templateInfoOrGeneratorFunctionBody !== 'string'
      ? this.responseGenerator.templateInfoOrGeneratorFunctionBody
      : undefined;
  }

  private get responseGeneratorParameterNames() {
    return this.responseGeneratorTemplateInfo ? this.responseGeneratorTemplateInfo.templateDataSnapshot.parameters.map(p => p.name) : [];
  }

  render() {
    return (
      // isDisabled => opacity: 0.3
      <div class='node' style={{}}>
        <div
          class={`box ${this.nodeId === this.selectedNodeId ? `is-selected` : ``}`}
          onClick={() => this.onSelect(this.node.id)}
          style={{
            padding: '0.75rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            position: 'relative',
            border: '0.125rem solid transparent',
            transition: 'border-color ease 200ms',
            margin: 0,
          }}
        >

          <div style={{ display: 'flex', alignItems: 'center' }}>

            <div style={{ display: 'flex', alignItems: 'center', minWidth: '120px', marginRight: '2em' }}>
              <div
                class={`icon expansion-toggle-trigger ${this.childNodeIds.length === 0 ? `is-disabled` : ``} ${this.isExpanded ? `is-expanded` : ``}`}
                onClick={(e: Event) => { this.isExpanded = !this.isExpanded; e.stopPropagation(); }}
              >
                <fa-icon icon='chevron-right' class='expansion-toggle-icon' />
              </div>
              <h3 class='name is-size-5'>
                {this.node.name}
              </h3>
            </div>

            {this.node.description &&
              <div class='description'>
                <i>{this.node.description}</i>
              </div>
            }

            <div class='parameter-preview'>
              {
                this.parameterNames.map(name =>
                  <span key={name} class='parameter'>
                    <label class='label'>{name}:</label>
                    <span class='value'>{this.templateInfo!.parameterValues[name].toString()}</span>
                  </span>
                )
              }
            </div>

          </div>

          {this.responseGenerator &&
            <div style={{ display: 'flex', alignItems: 'center' }}>

              <div style={{ display: 'flex', alignItems: 'center', minWidth: '120px', marginRight: '2em' }}>
                <div class='icon'>
                  <fa-icon icon='arrow-left' />
                </div>
                <h3 class='name is-size-5'>
                  {this.responseGenerator!.name}
                </h3>
              </div>

              {this.responseGenerator!.description &&
                <div class='description'>
                  <i>{this.responseGenerator!.description}</i>
                </div>
              }

              <div class='parameter-preview'>
                {
                  this.responseGeneratorParameterNames.map(name =>
                    <span key={name} class='parameter'>
                      <label class='label'>{name}:</label>
                      <span class='value'>{this.responseGeneratorTemplateInfo!.parameterValues[name].toString()}</span>
                    </span>
                  )
                }
              </div>

            </div>
          }

        </div>

        {this.childNodeIds.length > 0 &&
          <ExpansionContainer isExpanded={this.isExpanded}>
            <div class='child-nodes'>
              {
                this.childNodeIds.map(id =>
                  <PredicateNodeView
                    key={id}
                    nodeId={id}
                    selectedNodeId={this.selectedNodeId}
                    onSelect={nodeId => this.onSelect(nodeId)}
                  />
                )
              }
            </div>
          </ExpansionContainer>
        }

      </div>
    );
  }
}
