import { pure } from '../../ui-infrastructure';
import './predicate-template-row.scss';
import predicateTemplates from './predicate-template.store';

export interface PredicateTemplateRowProps {
  templateId: string;
  onEdit: () => any;
  onDelete: () => any;
}

export const PredicateTemplateRowDef = ({ templateId, onEdit, onDelete }: PredicateTemplateRowProps) => {
  const template = predicateTemplates.state.templatesById[templateId];

  return (
    <tr class='predicate-template-row'>
      <td>
        {template.name}
      </td>

      <td>
        {template.description}
      </td>

      <td>
        <div class='buttons is-marginless'>
          <button
            class='button is-danger'
            type='button'
            onClick={onDelete}
          >
            <span>Delete</span>
            <span class='icon is-small'>
              <fa-icon icon='times' />
            </span>
          </button>
          <button
            class='button is-primary'
            type='button'
            onClick={onEdit}
          >
            <span>Edit</span>
            <span class='icon is-small'>
              <fa-icon icon='edit' />
            </span>
          </button>
        </div>
      </td>

    </tr>
  );
};

export const PredicateTemplateRow = pure(PredicateTemplateRowDef);
