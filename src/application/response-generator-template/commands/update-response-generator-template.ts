import { Command, createCommandFn } from 'src/application/infrastructure/cqrs';
import { Diff } from 'src/domain/infrastructure/diff';
import { ResponseGeneratorTemplateAggregate, ResponseGeneratorTemplateData } from 'src/domain/response-generator-template';
import { CommandValidationConstraints } from 'src/infrastructure/cqrs';
import { versionedRepository } from 'src/infrastructure/db';

export type UpdateResponseGeneratorTemplateCommandType = 'update-response-generator-template';

export interface UpdateResponseGeneratorTemplateCommand
  extends Command<UpdateResponseGeneratorTemplateCommandType, UpdateResponseGeneratorTemplateCommandResponse> {
  templateId: string;
  unmodifiedTemplateVersion: number;
  diff: Diff<ResponseGeneratorTemplateData>;
}

export interface UpdateResponseGeneratorTemplateCommandResponse {
  templateId: string;
  templateVersion: number;
}

const repo = versionedRepository<ResponseGeneratorTemplateAggregate>('response-generator-template');

export async function updateResponseGeneratorTemplateHandler(command: UpdateResponseGeneratorTemplateCommand) {
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

export const updateResponseGeneratorTemplate = createCommandFn<UpdateResponseGeneratorTemplateCommand>('update-response-generator-template');

// TODO: validate
export const updateResponseGeneratorTemplateConstraints: CommandValidationConstraints<UpdateResponseGeneratorTemplateCommand> = {
  templateId: {},
  unmodifiedTemplateVersion: {},
  diff: {},
};
