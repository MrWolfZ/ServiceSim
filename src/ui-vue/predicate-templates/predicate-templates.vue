<script lang="tsx">
import { Component, Vue } from 'vue-property-decorator';
import PredicateTemplateDialog from './predicate-template-dialog.vue';

@Component({
  components: {
    PredicateTemplateDialog,
  },
})
export default class PredicateTemplatesPage extends Vue {
  tiles: string[] = [];
  private filterValue = '';

  private newItemDialog = () => this.$refs[this.newItemDialog.name] as PredicateTemplateDialog;

  render() {
    return (
      <div class='page'>
        <h1 class='title'>
          Predicate Templates
        </h1>

        { this.tiles.length > 0 &&
          <div>
            <div class='level is-mobile'>
              <div class='level-left'>
                <div class='field'>
                  <p class='control'>
                    <input class='input filter'
                           placeholder='Filter...'
                           value={this.filterValue}
                           onInput={ (e: Event) => this.filterValue = (e.target as HTMLInputElement).value } />
                  </p>
                </div>
              </div>
              <div class='level-right'>
                <button class='button is-primary'
                        onClick={() => this.newItemDialog().openDialog()}>
                  <span>Create new template</span>
                  <span class='icon is-small'>
                    <fa-icon icon='plus'></fa-icon>
                  </span>
                </button>
              </div>
            </div>
            <div class='columns is-multiline'>
              {
                this.tiles.map(item =>
                  <div class='column is-4-fullhd is-6-desktop is-12-tablet'>
                    <sim-predicate-template-tile state={item}></sim-predicate-template-tile>
                  </div>
                )
              }
            </div>
          </div>
        }
        { this.tiles.length === 0 &&
          <div>
            <p>There are no predicate templates yet.</p>
            <br />
            { /* TODO: add button to create default predicate templates */ }
            <button class='button is-primary'
                    onClick={() => this.newItemDialog().openDialog()}>
              <span>Create new template</span>
              <span class='icon is-small'>
                <fa-icon icon='plus'></fa-icon>
              </span>
            </button>
          </div>
        }

        <PredicateTemplateDialog ref={this.newItemDialog.name}></PredicateTemplateDialog>
      </div>
    );
  }
}
</script>

<style scoped lang="scss">
</style>
