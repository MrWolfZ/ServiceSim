<script lang="tsx">
import { Component, Vue } from 'vue-property-decorator';
import predicateTemplates from '../domain/predicate-templates';
import PredicateTemplateDialog from './predicate-template-dialog.vue';
import PredicateTemplateTile from './predicate-template-tile.vue';

@Component({
  components: {
    PredicateTemplateDialog,
    PredicateTemplateTile,
  },
})
export default class PredicateTemplatesPage extends Vue {
  private filterValue = '';

  private newItemDialog() {
    return this.$refs[this.newItemDialog.name] as PredicateTemplateDialog;
  }

  created() {
    predicateTemplates.loadAllAsync();
  }

  get templates() {
    return predicateTemplates.all;
  }

  render() {
    return (
      <div class='page'>
        <h1 class='title'>
          Predicate Templates
        </h1>

        { this.templates.length > 0 &&
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
                        onClick={() => this.newItemDialog().openNewItemDialog()}>
                  <span>Create new template</span>
                  <span class='icon is-small'>
                    <fa-icon icon='plus'></fa-icon>
                  </span>
                </button>
              </div>
            </div>
            <div class='columns is-multiline'>
              {
                this.templates.map(template =>
                  <div class='column is-4-fullhd is-6-desktop is-12-tablet'>
                    <PredicateTemplateTile templateId={template.id}></PredicateTemplateTile>
                  </div>
                )
              }
            </div>
          </div>
        }
        { this.templates.length === 0 &&
          <div>
            <p>There are no predicate templates yet.</p>
            <br />
            { /* TODO: add button to create default predicate templates */ }
            <button class='button is-primary'
                    onClick={() => this.newItemDialog().openNewItemDialog()}>
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
