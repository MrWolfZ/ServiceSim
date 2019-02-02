import { Command, createCommandFn } from 'src/application/infrastructure/cqrs';
import { ResponseGeneratorTemplateAggregate } from 'src/domain/response-generator-template';
import { CommandValidationConstraints } from 'src/infrastructure/cqrs';
import { versionedRepository } from 'src/infrastructure/db';

export type DeleteResponseGeneratorTemplateCommandType = 'delete-response-generator-template';

export interface DeleteResponseGeneratorTemplateCommand extends Command<DeleteResponseGeneratorTemplateCommandType> {
  templateId: string;
  unmodifiedTemplateVersion: number;
}

const repo = versionedRepository<ResponseGeneratorTemplateAggregate>('response-generator-template');

export async function deleteResponseGeneratorTemplateHandler(command: DeleteResponseGeneratorTemplateCommand) {
  return await repo.delete(command.templateId, command.unmodifiedTemplateVersion);
}

export const deleteResponseGeneratorTemplate = createCommandFn<DeleteResponseGeneratorTemplateCommand>('delete-response-generator-template');

// TODO: validate
export const deleteResponseGeneratorTemplateConstraints: CommandValidationConstraints<DeleteResponseGeneratorTemplateCommand> = {
  templateId: {},
  unmodifiedTemplateVersion: {},
};
