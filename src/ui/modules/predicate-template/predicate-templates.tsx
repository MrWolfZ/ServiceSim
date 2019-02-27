import { Observable, of } from 'rxjs';
import { stateful } from 'src/ui/infrastructure/stateful-component';
import { PrimaryButton } from 'src/ui/shared/common-components/button';
import { Page } from 'src/ui/shared/common-components/page';
import { navigateToPredicateTemplateDetails } from 'src/ui/shared/routing';
import { PredicateTemplateRow } from './predicate-template-row';
import predicateTemplates, { PredicateTemplateState } from './predicate-template.store';

interface PredicateTemplatesPageProps {
  templates: Observable<PredicateTemplateState[]>;
}

interface PredicateTemplatesPageState {
  filterValue: string;
}

const initialState: PredicateTemplatesPageState = {
  filterValue: '',
};

export const PredicateTemplatesPage = stateful<PredicateTemplatesPageState, PredicateTemplatesPageProps>(
  initialState,
  { templates: of(predicateTemplates.all) },
  function PredicateTemplatesPage({ filterValue, templates, patchState }) {
    templates = templates || [];
    const upperCaseFilterValue = filterValue.toUpperCase();
    const filteredTemplates = templates.filter(
      t =>
        !upperCaseFilterValue
        || t.name.toUpperCase().includes(upperCaseFilterValue)
        || t.description.toUpperCase().includes(upperCaseFilterValue)
        || t.evalFunctionBody.toUpperCase().includes(upperCaseFilterValue)
    );

    return (
      <Page title='Predicate Templates'>

        {templates.length > 0 &&
          <div class='flex-column flex-fill'>
            <div class='level is-mobile'>
              <div class='level-left'>
                <div class='field'>
                  <p class='control'>
                    <input
                      class='input'
                      placeholder='Filter...'
                      value={filterValue}
                      onInput={(e: Event) => patchState(() => ({ filterValue: (e.target as HTMLInputElement).value }))}
                    />
                  </p>
                </div>
              </div>

              <div class='level-right'>
                <PrimaryButton
                  label='Create new template'
                  icon='plus'
                  onClick={() => navigateToPredicateTemplateDetails('new')}
                />
              </div>
            </div>

            <div class='flex-fill'>
              <table class='table' width='100%'>
                <thead>
                  <tr>
                    <th width={200}>Name</th>
                    <th>Description</th>
                    <th width={200}>Tags</th>
                    <th width={200} />
                  </tr>
                </thead>

                <tbody>
                  {
                    filteredTemplates.map(template =>
                      <PredicateTemplateRow
                        template={predicateTemplates.state.templatesById[template.id]}
                        onEdit={() => navigateToPredicateTemplateDetails(template.id)}
                        onDelete={() => deleteTemplate(template.id)}
                      />
                    )
                  }
                </tbody>
              </table>
            </div>

            {filteredTemplates.length === 0 &&
              <p>No templates match your filter.</p>
            }
          </div>
        }

        {templates.length === 0 &&
          <div>
            <p>There are no predicate templates yet.</p>
            <br />

            { /* TODO: add button to create default predicate templates */}

            <PrimaryButton
              label='Create new template'
              icon='plus'
              onClick={() => navigateToPredicateTemplateDetails('new')}
            />
          </div>
        }

      </Page>
    );

    async function deleteTemplate(templateId: string) {
      await predicateTemplates.deleteAsync(templateId);
    }
  },
);

export default PredicateTemplatesPage;
