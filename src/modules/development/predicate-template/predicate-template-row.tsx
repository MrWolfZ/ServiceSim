import { DangerButton, PrimaryButton, pure } from '../../../ui-infrastructure';
import './predicate-template-row.scss';
import { PredicateTemplateState } from './predicate-template.types';

export interface PredicateTemplateRowProps {
  template: PredicateTemplateState;
  onEdit: () => any;
  onDelete: () => any;
}

export const PredicateTemplateRowDef = ({ template, onEdit, onDelete }: PredicateTemplateRowProps) => {
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
};

export const PredicateTemplateRow = pure(PredicateTemplateRowDef);
