import { PrimaryButton } from 'src/ui-infrastructure';
import { Component, Vue } from 'vue-property-decorator';
import { PredicateTemplateRow } from './predicate-template-row';
import predicateTemplates from './predicate-template.store';

@Component({})
export default class PredicateTemplatesPage extends Vue {
  private filterValue = '';

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
                      class='input'
                      placeholder='Filter...'
                      value={this.filterValue}
                      onInput={(e: Event) => this.filterValue = (e.target as HTMLInputElement).value}
                    />
                  </p>
                </div>
              </div>

              <div class='level-right'>
                <PrimaryButton
                  label='Create new template'
                  icon='plus'
                  onClick={() => this.navigateToEditPage('new')}
                />
              </div>
            </div>

            <div>
              <table class='table' width='100%'>
                <thead>
                  <tr>
                    <th width={200}>Name</th>
                    <th>Description</th>
                    <th width={200} />
                  </tr>
                </thead>

                <tbody>
                  {
                    this.filteredTemplates.map(template =>
                      <PredicateTemplateRow
                        key={template.id}
                        template={predicateTemplates.state.templatesById[template.id]}
                        onEdit={() => this.navigateToEditPage(template.id)}
                        onDelete={() => this.deleteTemplate(template.id)}
                      />
                    )
                  }
                </tbody>
              </table>
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

            <PrimaryButton
              label='Create new template'
              icon='plus'
              onClick={() => this.navigateToEditPage('new')}
            />
          </div>
        }

      </div>
    );
  }
}
