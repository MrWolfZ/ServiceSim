import { ResponseGeneratorTemplateAggregate, ResponseGeneratorTemplateData } from 'src/domain/response-generator-template';
import { Command, CommandValidationConstraints, createCommandFn } from 'src/infrastructure/cqrs';
import { versionedRepository } from 'src/infrastructure/db';

export type CreateResponseGeneratorTemplateCommandType = 'create-response-generator-template';

export interface CreateResponseGeneratorTemplateCommand extends
  ResponseGeneratorTemplateData, Command<CreateResponseGeneratorTemplateCommandType, CreateResponseGeneratorTemplateCommandResponse> { }

export interface CreateResponseGeneratorTemplateCommandResponse {
  templateId: string;
  templateVersion: number;
}

const repo = versionedRepository<ResponseGeneratorTemplateAggregate>('response-generator-template');

export async function createResponseGeneratorTemplateHandler(
  command: CreateResponseGeneratorTemplateCommand,
): Promise<CreateResponseGeneratorTemplateCommandResponse> {
  const template = await repo.create({
    name: command.name,
    description: command.description,
    tags: command.tags,
    generatorFunctionBody: command.generatorFunctionBody,
    parameters: command.parameters,
  });

  return {
    templateId: template.id,
    templateVersion: 1,
  };
}

export const createResponseGeneratorTemplate = createCommandFn<CreateResponseGeneratorTemplateCommand>('create-response-generator-template');

// TODO: validate
export const createResponseGeneratorTemplateConstraints: CommandValidationConstraints<CreateResponseGeneratorTemplateCommand> = {
  name: {},
  description: {},
  tags: {},
  generatorFunctionBody: {},
  parameters: {},
};
