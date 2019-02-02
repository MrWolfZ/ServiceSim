import { Command } from 'src/application/infrastructure/cqrs';
import { Diff } from 'src/domain/infrastructure/diff';
import { PredicateTemplateAggregate, PredicateTemplateData } from 'src/domain/predicate-template';
import { CommandValidationConstraints } from 'src/infrastructure/cqrs';
import { versionedRepository } from 'src/infrastructure/db';

export type UpdatePredicateTemplateCommandType = 'update-predicate-template';

export interface UpdatePredicateTemplateCommand extends Command<UpdatePredicateTemplateCommandType, UpdatePredicateTemplateCommandResponse> {
  templateId: string;
  unmodifiedTemplateVersion: number;
  diff: Diff<PredicateTemplateData>;
}

export interface UpdatePredicateTemplateCommandResponse {
  templateId: string;
  templateVersion: number;
}

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
