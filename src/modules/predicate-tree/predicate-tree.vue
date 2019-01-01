<script lang="tsx">
import { Component, Vue } from 'vue-property-decorator';
import PredicateNodeDetails from './predicate-node-details.vue';
import PredicateNodeDialog from './predicate-node-dialog.vue';
import predicateNodes from './predicate-node.store';
import PredicateNodeView from './predicate-node.vue';

@Component({})
export default class PredicateTreePage extends Vue {
  private selectedNodeId = this.topLevelNodeIds[0];

  created() {
    predicateNodes.loadAllAsync();
  }

  get rootNode() {
    return predicateNodes.all[0];
  }

  get topLevelNodeIds() {
    return this.rootNode.childNodeIdsOrResponseGenerator as string[];
  }

  private editNode(nodeId: string) {
    console.log('edit', nodeId);
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
      <div class='page'>
        <div class='columns'>
          <div class='column is-12-tablet is-6-desktop is-8-widescreen tree-column'>
            <h1 class='title'>
              Predicate Tree
            </h1>

            <div class='nodes'>
              {
                this.topLevelNodeIds.map(id =>
                  <PredicateNodeView
                    class='node'
                    key={id}
                    nodeId={id}
                    selectedNodeId={this.selectedNodeId}
                    onSelect={nodeId => this.selectedNodeId = nodeId}
                  />
                )
              }
            </div>
          </div>

          { /* TODO build open and close mechanism for small devices */}
          <div class='column is-12-tablet is-6-desktop is-4-widescreen details-column'>
            <PredicateNodeDetails
              class='node-details'
              nodeId={this.selectedNodeId}
              onEdit={() => this.editNode(this.selectedNodeId)}
              onDelete={() => this.deleteNode(this.selectedNodeId)}
              onAddChildNode={() => this.addChildNode(this.selectedNodeId)}
              onSetResponseGenerator={() => this.setResponseGenerator(this.selectedNodeId)}
              onEditResponseGenerator={() => this.editResponseGenerator(this.selectedNodeId)}
              onRemoveResponseGenerator={() => this.removeResponseGenerator(this.selectedNodeId)}
              onSelectChildNode={nodeId => this.selectedNodeId = nodeId}
            />
          </div>
        </div>

        <PredicateNodeDialog />
      </div>
    );
  }
}
</script>

<style scoped lang="scss">
@import 'variables';
@import '~bulma/sass/utilities/mixins';

.page {
  padding-top: 0;
  padding-bottom: 0;
}

.columns {
  height: 100%;
  margin-top: 0;
}

.column {
  height: 100%;
  padding-top: 2rem;
  padding-bottom: 2rem;
  transition: all ease 200ms;

  &.tree-column {
    display: flex;
    flex-direction: column;
  }

  @include until($desktop) {
    &.details-column {
      width: 0%;
      padding: 0;
      overflow: hidden;
    }
  }
}

.nodes {
  flex: 1;
  overflow-y: auto;
  padding-right: 1rem;
}

.node:last-child >>> .box {
  margin-bottom: 0;
}

.node-details {
  display: block;
  min-width: 400px;
}
</style>
