import { Command, createCommandFn } from 'src/application/infrastructure/cqrs';
import { PredicateTemplateAggregate, PredicateTemplateData } from 'src/domain/predicate-template';
import { CommandValidationConstraints } from 'src/infrastructure/cqrs';
import { versionedRepository } from 'src/infrastructure/db';

export type CreatePredicateTemplateCommandType = 'create-predicate-template';

export interface CreatePredicateTemplateCommand extends
  PredicateTemplateData, Command<CreatePredicateTemplateCommandType, CreatePredicateTemplateCommandResponse> { }

export interface CreatePredicateTemplateCommandResponse {
  templateId: string;
  templateVersion: number;
}

const repo = versionedRepository<PredicateTemplateAggregate>('predicate-template');

export async function createPredicateTemplateHandler(command: CreatePredicateTemplateCommand): Promise<CreatePredicateTemplateCommandResponse> {
  const template = await repo.create({
    name: command.name,
    description: command.description,
    evalFunctionBody: command.evalFunctionBody,
    parameters: command.parameters,
  });

  return {
    templateId: template.id,
    templateVersion: 1,
  };
}

export const createPredicateTemplate = createCommandFn<CreatePredicateTemplateCommand>('create-predicate-template');

// TODO: validate
export const createPredicateTemplateConstraints: CommandValidationConstraints<CreatePredicateTemplateCommand> = {
  name: {},
  description: {},
  evalFunctionBody: {},
  parameters: {},
};
