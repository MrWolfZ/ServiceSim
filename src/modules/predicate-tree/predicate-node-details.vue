<script lang="tsx">
import { Component, Prop } from 'vue-property-decorator';
import { Emit, TsxComponent } from '../../ui-infrastructure';
import predicateNodes from './predicate-node.store';

export interface PredicateNodeDetailsProps {
  nodeId: string;
  onEdit: () => any;
  onDelete: () => any;
  onAddChildNode: () => any;
  onSetResponseGenerator: () => any;
  onEditResponseGenerator: () => any;
  onRemoveResponseGenerator: () => any;
  onSelectChildNode: (nodeId: string) => any;
}

@Component({})
export default class PredicateNodeDetails extends TsxComponent<PredicateNodeDetailsProps> implements PredicateNodeDetailsProps {
  @Prop() nodeId: string;

  @Emit()
  onEdit() { }

  @Emit()
  onDelete() { }

  @Emit()
  onAddChildNode() { }

  @Emit()
  onSetResponseGenerator() { }

  @Emit()
  onRemoveResponseGenerator() { }

  @Emit()
  onEditResponseGenerator() { }

  @Emit()
  onSelectChildNode(_: string) { }

  private get node() {
    return predicateNodes.state.nodesById[this.nodeId];
  }

  private get childNodeIds() {
    return Array.isArray(this.node.childNodeIdsOrResponseGenerator) ? this.node.childNodeIdsOrResponseGenerator : [];
  }

  private getChildNodeName(nodeId: string) {
    return predicateNodes.state.nodesById[nodeId].name;
  }

  private get templateInfo() {
    return typeof this.node.templateInfoOrEvalFunctionBody !== 'string' ? this.node.templateInfoOrEvalFunctionBody : undefined;
  }

  private get evalFunctionBody() {
    return typeof this.node.templateInfoOrEvalFunctionBody === 'string' ? this.node.templateInfoOrEvalFunctionBody : undefined;
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

  private get generatorFunctionBody() {
    return this.responseGenerator && typeof this.responseGenerator.templateInfoOrGeneratorFunctionBody === 'string'
      ? this.responseGenerator.templateInfoOrGeneratorFunctionBody
      : undefined;
  }

  private get responseGeneratorParameterNames() {
    return this.responseGeneratorTemplateInfo ? this.responseGeneratorTemplateInfo.templateDataSnapshot.parameters.map(p => p.name) : [];
  }

  render() {
    return (
      <div class='node-details'>
        <h1 class='title'>
          Predicate Node
        </h1>

        <div class='box content'>

          <div class='level is-marginless is-mobile'>

            <div class='level-left'>
              <h3>
                {this.node.name}
              </h3>
            </div>

            <div class='level-right'>

              <div class='buttons is-marginless'>

                <button
                  class='button is-danger'
                  type='button'
                  onClick={() => this.onDelete()}
                >
                  <span>Delete</span>
                  <span class='icon is-small'>
                    <fa-icon icon='times' />
                  </span>
                </button>

                <button
                  class='button is-primary'
                  type='button'
                  onClick={() => this.onEdit()}
                >
                  <span>Edit</span>
                  <span class='icon is-small'>
                    <fa-icon icon='edit' />
                  </span>
                </button>

              </div>

            </div>

          </div>

          {this.templateInfo &&
            <p>
              Based on template <a>{this.templateInfo!.templateDataSnapshot.name}</a>
            </p>
          }

          {this.node.description &&
            <p>
              <i>{this.node.description}</i>
            </p>
          }

          {this.templateInfo &&
            <div class='group'>

              <h5>
                Parameter Values
              </h5>

              {this.parameterNames.length === 0 &&
                <p>
                  This node's template does not have any parameters.
                </p>
              }

              {
                this.parameterNames.map(name =>
                  <div key={name} class='parameter'>

                    <label class='label'>
                      {name}:
                    </label>

                    <span class='value'>
                      {this.templateInfo!.parameterValues[name]}
                    </span>

                  </div>
                )
              }

            </div>
          }

          {!this.templateInfo &&
            <div class='group'>

              <h5>
                Function Body
              </h5>

              <pre><code>{this.evalFunctionBody}</code></pre>

            </div>
          }

          {!this.responseGenerator &&
            <div class='group'>

              <h5>
                Child Nodes
              </h5>

              {this.childNodeIds.length === 0 &&
                <p>
                  This predicate node does not have any child nodes.
                </p>
              }

              {
                this.childNodeIds.map(id =>
                  <div key={id} class='child-node'>

                    <a onClick={() => this.onSelectChildNode(id)}>
                      {this.getChildNodeName(id)}
                    </a>

                  </div>
                )
              }

              <button
                class='button is-primary'
                type='button'
                onClick={() => this.onAddChildNode()}
              >
                <span>Add Child Node</span>
                <span class='icon is-small'>
                  <fa-icon icon='plus' />
                </span>
              </button>

            </div>
          }

          {!this.responseGenerator && this.childNodeIds.length === 0 &&
            <div class='group'>

              <h5>
                Response Generator
              </h5>

              <p>
                This predicate node does not have a response generator.
              </p>

              <button
                class='button is-primary'
                type='button'
                onClick={() => this.onSetResponseGenerator()}
              >
                <span>Set Response Generator</span>
                <span class='icon is-small'>
                  <fa-icon icon='plus' />
                </span>
              </button>

            </div>
          }

        </div>

        {this.responseGenerator &&
          <h1 class='title'>
            Response Generator
        </h1>
        }

        {this.responseGenerator &&
          <div class='box content'>

            <div class='level is-marginless is-mobile'>

              <div class='level-left'>
                <h3>
                  {this.responseGenerator!.name}
                </h3>
              </div>

              <div class='level-right'>

                <div class='buttons is-marginless'>

                  <button
                    class='button is-danger'
                    type='button'
                    onClick={() => this.onRemoveResponseGenerator()}
                  >
                    <span>Remove</span>
                    <span class='icon is-small'>
                      <fa-icon icon='times' />
                    </span>
                  </button>

                  <button
                    class='button is-primary'
                    type='button'
                    onClick={() => this.onEditResponseGenerator()}
                  >
                    <span>Edit</span>
                    <span class='icon is-small'>
                      <fa-icon icon='edit' />
                    </span>
                  </button>

                </div>

              </div>

            </div>

            {this.responseGeneratorTemplateInfo &&
              <p>
                Based on template <a>{this.responseGeneratorTemplateInfo!.templateDataSnapshot.name}</a>
              </p>
            }

            {this.responseGenerator!.description &&
              <p>
                <i>{this.responseGenerator!.description}</i>
              </p>
            }

            {this.responseGeneratorTemplateInfo &&
              <div class='group'>

                <h5>
                  Parameter Values
                </h5>

                {this.responseGeneratorParameterNames.length === 0 &&
                  <p>
                    This response generator's template does not have any parameters.
                  </p>
                }

                {
                  this.responseGeneratorParameterNames.map(name =>
                    <div key={name} class='parameter'>

                      <label class='label'>
                        {name}:
                      </label>

                      <span class='value'>
                        {this.responseGeneratorTemplateInfo!.parameterValues[name]}
                      </span>

                    </div>
                  )
                }

              </div>
            }

            {!this.responseGeneratorTemplateInfo &&
              <div class='group'>

                <h5>
                  Function Body
                </h5>

                <pre><code>{this.generatorFunctionBody}</code></pre>

              </div>
            }

          </div>
        }
      </div>
    );
  }
}
</script>

<style scoped lang="scss">
@import 'variables';

.node-details {
  display: flex;
  flex-direction: column;
  height: 100%;

  // TODO: fix scrolling
  // >.box {
  //   overflow-y: auto;
  //   overflow-x: hidden;
  // }
}

.group {
  &:not(:last-child) {
    margin-bottom: 1rem;
  }
}

.parameter {
  display: flex;

  + .button {
    margin-top: 1em;
  }
}

.child-node + .button {
  margin-top: 1em;
}

.label {
  margin-bottom: 0;
  margin-right: 0.25rem;
}

.button {
  transition: none;
}
</style>
