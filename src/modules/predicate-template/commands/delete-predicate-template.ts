import { CommandValidationConstraints, DB } from '../../../api-infrastructure';
import { DeletePredicateTemplateCommand, PredicateTemplateAggregate } from '../predicate-template.types';

const repo = DB.versionedRepository<PredicateTemplateAggregate>('predicate-template');

export async function deletePredicateTemplate(command: DeletePredicateTemplateCommand) {
  return await repo.delete(command.templateId, command.unmodifiedTemplateVersion);
}

// TODO: validate
export const deletePredicateTemplateConstraints: CommandValidationConstraints<DeletePredicateTemplateCommand> = {
  templateId: {},
  unmodifiedTemplateVersion: {},
};
