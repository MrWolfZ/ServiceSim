import { Component, Vue } from 'vue-property-decorator';
import { PredicateNodeView } from './predicate-node';
import { PredicateNodeDetails } from './predicate-node-details';
import { PredicateNodeDialog } from './predicate-node-dialog';
import predicateNodes from './predicate-node.store';
import './predicate-tree.scss';

@Component({})
export default class PredicateTreePage extends Vue {
  private selectedNodeId: string | undefined = this.topLevelNodeIds[0];

  private dialog() {
    return this.$refs[this.dialog.name] as PredicateNodeDialog;
  }

  get rootNode() {
    return predicateNodes.rootNode;
  }

  get topLevelNodeIds() {
    return this.rootNode ? this.rootNode.childNodeIdsOrResponseGenerator as string[] : [];
  }

  private deleteNode(nodeId: string) {
    console.log('delete', nodeId);
  }

  private addChildNode(nodeId: string) {
    console.log('add child node', nodeId);
  }

  private setResponseGenerator(nodeId: string) {
    console.log('set response generator', nodeId);
  }

  private editResponseGenerator(nodeId: string) {
    console.log('edit response generator', nodeId);
  }

  private removeResponseGenerator(nodeId: string) {
    console.log('remove response generator', nodeId);
  }

  render() {
    return (
      <div class='page predicate-tree-page'>
        <div class='columns'>
          <div class='column is-12-tablet is-6-desktop is-8-widescreen tree-column'>
            <h1 class='title'>
              Predicate Tree
            </h1>

            {this.topLevelNodeIds.length > 0 &&
              <div class='nodes'>
                {
                  this.topLevelNodeIds.map(id =>
                    <PredicateNodeView
                      class='node'
                      key={id}
                      nodeId={id}
                      selectedNodeId={this.selectedNodeId!}
                      onSelect={nodeId => this.selectedNodeId = nodeId}
                    />
                  )
                }
              </div>
            }

            {this.topLevelNodeIds.length === 0 &&
              <div>
                <p>There are no predicate nodes yet.</p>
                <br />
                <button
                  class='button is-primary'
                  onClick={() => this.dialog().openForNewNode()}
                >
                  <span>Create new node</span>
                  <span class='icon is-small'>
                    <fa-icon icon='plus' />
                  </span>
                </button>
              </div>
            }
          </div>

          { /* TODO build open and close mechanism for small devices */}
          <div class='column is-12-tablet is-6-desktop is-4-widescreen details-column'>
            {this.selectedNodeId &&
              <PredicateNodeDetails
                class='node-details'
                nodeId={this.selectedNodeId}
                onEdit={() => this.dialog().openForExistingNode(predicateNodes.state.nodesById[this.selectedNodeId!])}
                onDelete={() => this.deleteNode(this.selectedNodeId!)}
                onAddChildNode={() => this.addChildNode(this.selectedNodeId!)}
                onSetResponseGenerator={() => this.setResponseGenerator(this.selectedNodeId!)}
                onEditResponseGenerator={() => this.editResponseGenerator(this.selectedNodeId!)}
                onRemoveResponseGenerator={() => this.removeResponseGenerator(this.selectedNodeId!)}
                onSelectChildNode={nodeId => this.selectedNodeId = nodeId}
              />
            }
          </div>
        </div>

        <PredicateNodeDialog ref={this.dialog.name} onSubmit={() => void 0} />
      </div>
    );
  }
}
