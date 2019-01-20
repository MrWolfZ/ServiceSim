<script lang="tsx">
import { Component, Vue } from 'vue-property-decorator';
import PredicateTemplateTile from './predicate-template-tile.vue';
import predicateTemplates from './predicate-template.store';

@Component({})
export default class PredicateTemplatesPage extends Vue {
  private filterValue = '';

  async created() {
    await predicateTemplates.loadAllAsync();
  }

  private get templates() {
    return predicateTemplates.all;
  }

  private get filteredTemplates() {
    const upperCaseFilterValue = this.filterValue.toUpperCase();
    return this.templates.filter(
      t =>
        !upperCaseFilterValue
        || t.name.toUpperCase().includes(upperCaseFilterValue)
        || t.description.toUpperCase().includes(upperCaseFilterValue)
        || t.evalFunctionBody.toUpperCase().includes(upperCaseFilterValue)
    );
  }

  private async deleteTemplate(templateId: string) {
    await predicateTemplates.deleteAsync(templateId);
  }

  private navigateToEditPage(templateId: string) {
    this.$router.push(`/predicate-templates/${templateId}`);
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
                    <input
                      class='input filter'
                      placeholder='Filter...'
                      value={this.filterValue}
                      onInput={(e: Event) => this.filterValue = (e.target as HTMLInputElement).value}
                    />
                  </p>
                </div>
              </div>
              <div class='level-right'>
                <button
                  class='button is-primary'
                  onClick={() => this.navigateToEditPage('new')}
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
                this.filteredTemplates.map(template =>
                  <div key={template.id} class='column is-4-fullhd is-6-desktop is-12-tablet'>
                    <PredicateTemplateTile
                      templateId={template.id}
                      onEdit={() => this.navigateToEditPage(template.id)}
                      onDelete={() => this.deleteTemplate(template.id)}
                    />
                  </div>
                )
              }
            </div>

            {this.filteredTemplates.length === 0 &&
              <p>No templates match your filter.</p>
            }
          </div>
        }

        {this.templates.length === 0 &&
          <div>
            <p>There are no predicate templates yet.</p>
            <br />
            { /* TODO: add button to create default predicate templates */}
            <button
              class='button is-primary'
              onClick={() => this.navigateToEditPage('new')}
            >
              <span>Create new template</span>
              <span class='icon is-small'>
                <fa-icon icon='plus' />
              </span>
            </button>
          </div>
        }

      </div>
    );
  }
}
</script>

<style scoped lang="scss">
</style>
