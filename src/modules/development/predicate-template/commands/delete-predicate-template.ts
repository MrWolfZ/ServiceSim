import { CommandValidationConstraints, versionedRepository } from 'src/api-infrastructure';
import { DeletePredicateTemplateCommand, PredicateTemplateAggregate } from '../predicate-template.types';

const repo = versionedRepository<PredicateTemplateAggregate>('predicate-template');

export async function deletePredicateTemplate(command: DeletePredicateTemplateCommand) {
  return await repo.delete(command.templateId, command.unmodifiedTemplateVersion);
}

// TODO: validate
export const deletePredicateTemplateConstraints: CommandValidationConstraints<DeletePredicateTemplateCommand> = {
  templateId: {},
  unmodifiedTemplateVersion: {},
};
