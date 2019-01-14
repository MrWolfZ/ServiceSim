import { CommandValidationConstraints, versionedRepository } from '../../../api-infrastructure';
import { PredicateTemplateAggregate, UpdatePredicateTemplateCommand } from '../predicate-template.types';

const repo = versionedRepository<PredicateTemplateAggregate>('predicate-template');

export async function updatePredicateTemplate(command: UpdatePredicateTemplateCommand) {
  const newVersion = await repo.patch(
    command.templateId,
    command.unmodifiedTemplateVersion,
    command.diff,
  );

  return {
    templateId: command.templateId,
    templateVersion: newVersion,
  };
}

// TODO: validate
export const updatePredicateTemplateConstraints: CommandValidationConstraints<UpdatePredicateTemplateCommand> = {
  templateId: {},
  unmodifiedTemplateVersion: {},
  diff: {},
};
