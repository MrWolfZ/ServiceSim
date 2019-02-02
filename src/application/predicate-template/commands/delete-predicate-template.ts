import { Command, createCommandFn } from 'src/application/infrastructure/cqrs';
import { PredicateTemplateAggregate } from 'src/domain/predicate-template';
import { CommandValidationConstraints } from 'src/infrastructure/cqrs';
import { versionedRepository } from 'src/infrastructure/db';

export type DeletePredicateTemplateCommandType = 'delete-predicate-template';

export interface DeletePredicateTemplateCommand extends Command<DeletePredicateTemplateCommandType> {
  templateId: string;
  unmodifiedTemplateVersion: number;
}

const repo = versionedRepository<PredicateTemplateAggregate>('predicate-template');

export async function deletePredicateTemplateHandler(command: DeletePredicateTemplateCommand) {
  return await repo.delete(command.templateId, command.unmodifiedTemplateVersion);
}

export const deletePredicateTemplate = createCommandFn<DeletePredicateTemplateCommand>('delete-predicate-template');

// TODO: validate
export const deletePredicateTemplateConstraints: CommandValidationConstraints<DeletePredicateTemplateCommand> = {
  templateId: {},
  unmodifiedTemplateVersion: {},
};
