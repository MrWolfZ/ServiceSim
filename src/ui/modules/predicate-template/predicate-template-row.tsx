import { pure } from 'src/ui/infrastructure/tsx';
import { DangerButton, PrimaryButton } from 'src/ui/shared/common-components/button';
import './predicate-template-row.scss';
import { PredicateTemplateState } from './predicate-template.store';

export interface PredicateTemplateRowProps {
  template: PredicateTemplateState;
  onEdit: () => any;
  onDelete: () => any;
}

export const PredicateTemplateRow = pure(({ template, onEdit, onDelete }: PredicateTemplateRowProps) => {
  return (
    <tr class='predicate-template-row'>
      <td>
        {template.name}
      </td>

      <td>
        {template.description}
      </td>

      <td>
        {
          template.tags.map((t, idx) =>
            <span key={idx} class='tag is-primary'>{t}</span>
          )
        }
      </td>

      <td>
        <div class='buttons is-marginless'>
          <DangerButton
            label='Delete'
            icon='times'
            onClick={onDelete}
          />

          <PrimaryButton
            label='Edit'
            icon='edit'
            onClick={onEdit}
          />
        </div>
      </td>

    </tr>
  );
});
