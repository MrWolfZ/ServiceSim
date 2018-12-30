<script lang="tsx">
import { Component, Emit, Prop } from 'vue-property-decorator';
import ExpansionContainer from '../../ui-infrastructure/expansion-container.vue';
import { TsxComponent } from '../../ui-infrastructure/tsx-component';
import predicateNodes from './predicate-node.store';

export interface PredicateNodeViewProps {
  nodeId: string;
  selectedNodeId: string;
  onSelect: (nodeId: string) => any;
}

@Component({
  components: {
    ExpansionContainer,
  },
})
export default class PredicateNodeView extends TsxComponent<PredicateNodeViewProps> implements PredicateNodeViewProps {
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
      <div class='node'>
        <div class={`box ${this.nodeId === this.selectedNodeId ? `is-selected` : ``}`} onClick={() => this.onSelect(this.node.id)}>

          <div class='predicate'>

            <div class='name-spacer'>
              <div
                class={`icon expansion-toggle-trigger ${this.childNodeIds.length === 0 ? `is-disabled` : ``} ${this.isExpanded ? `is-expanded` : ``}`}
                onClick={(e: Event) => { this.isExpanded = !this.isExpanded; e.stopPropagation(); }}
              >
                <fa-icon icon='chevron-right' class='expansion-toggle-icon' />
              </div>
              <h3 class='is-size-5'>
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
                    <span class='value'>{this.templateInfo!.parameterValues[name]}</span>
                  </span>
                )
              }
            </div>

          </div>

          {this.responseGenerator &&
            <div class='response-generator'>

              <div class='name-spacer'>
                <div class='icon'>
                  <fa-icon icon='arrow-left' />
                </div>
                <h3 class='is-size-5'>
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
                      <span class='value'>{this.responseGeneratorTemplateInfo!.parameterValues[name]}</span>
                    </span>
                  )
                }
              </div>

            </div>
          }

        </div>

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
      </div>
    );
  }
}
</script>

<style scoped lang="scss">
@import 'variables';

.node {
  display: block;

  &.is-disabled {
    opacity: 0.3;
  }
}

.box {
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  border: 0.125rem solid transparent;
  transition: border-color ease 200ms;

  &.is-selected {
    border-color: rgba($link, 0.5);
  }
}

.predicate,
.response-generator {
  display: flex;
  align-items: center;
}

.name-spacer {
  display: flex;
  align-items: center;
  min-width: 120px;
  margin-right: 2em;
}

.description {
  margin-right: 2em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

h3 {
  white-space: nowrap;
  margin-left: 0.2em;
}

.parameter-preview {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  > .parameter {
    margin-right: 1em;

    > .label {
      display: inline-block;
      margin-bottom: 0;
      margin-right: 0.25rem;
    }
  }
}

.child-nodes {
  padding-left: 2.5em;
  border-left: 1px solid $grey-dark;
}

.expansion-toggle-trigger {
  cursor: pointer;

  &.is-expanded > .expansion-toggle-icon {
    transform: rotate(90deg);
  }

  &.is-disabled {
    cursor: inherit;

    > .expansion-toggle-icon {
      opacity: 0;
    }
  }
}

.expansion-toggle-icon {
  user-select: none;
  transition: transform ease 200ms;
}
</style>
