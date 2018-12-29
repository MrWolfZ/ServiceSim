<script lang="tsx">
import { Component, Vue } from 'vue-property-decorator';
import { Input } from '../../ui-infrastructure';
import PredicateTemplateDialog from './predicate-template-dialog.vue';
import PredicateTemplateTile from './predicate-template-tile.vue';
import predicateTemplates, { PredicateTemplate } from './predicate-template.store';

@Component({
  components: {
    PredicateTemplateDialog,
    PredicateTemplateTile,
    Input,
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

  private createNewTemplate(template: PredicateTemplate) {
    console.log(template);
  }

  render() {
    return (
      <div class='page'>
        <h1 class='title'>
          Predicate Templates
        </h1>

        {this.templates.length > 0 &&
          <div>
            <div class='level is-mobile'>
              <div class='level-left'>
                <div class='field'>
                  <p class='control'>
                    <Input
                      class='input filter'
                      placeholder='Filter...'
                      value={this.filterValue}
                      onInput={v => this.filterValue = v}
                    />
                  </p>
                </div>
              </div>
              <div class='level-right'>
                <button
                  class='button is-primary'
                  onClick={() => this.newItemDialog().openNewItemDialog()}
                >
                  <span>Create new template</span>
                  <span class='icon is-small'>
                    <fa-icon icon='plus' />
                  </span>
                </button>
              </div>
            </div>
            <div class='columns is-multiline'>
              {
                this.templates.map(template =>
                  <div key={template.id} class='column is-4-fullhd is-6-desktop is-12-tablet'>
                    <PredicateTemplateTile templateId={template.id} />
                  </div>
                )
              }
            </div>
          </div>
        }
        {this.templates.length === 0 &&
          <div>
            <p>There are no predicate templates yet.</p>
            <br />
            { /* TODO: add button to create default predicate templates */}
            <button
              class='button is-primary'
              onClick={() => this.newItemDialog().openNewItemDialog()}
            >
              <span>Create new template</span>
              <span class='icon is-small'>
                <fa-icon icon='plus' />
              </span>
            </button>
          </div>
        }

        <PredicateTemplateDialog ref={this.newItemDialog.name} onSubmit={t => this.createNewTemplate(t)} />
      </div>
    );
  }
}
</script>

<style scoped lang="scss">
</style>
