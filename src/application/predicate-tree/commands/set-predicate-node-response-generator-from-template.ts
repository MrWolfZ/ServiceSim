import { TemplateInfo } from 'src/domain/predicate-tree';
import { Command, CommandValidationConstraints, createCommandFn } from 'src/infrastructure/cqrs';
import { failure } from 'src/util';
import { predicateNodeRepo } from '../predicate-node.repo';

export type SetResponseGeneratorFromTemplateCommandType = 'set-response-generator-from-template';

export interface SetResponseGeneratorFromTemplateCommand
  extends Command<SetResponseGeneratorFromTemplateCommandType, SetResponseGeneratorFromTemplateCommandResponse> {
  nodeId: string;
  unmodifiedNodeVersion: number;
  name: string;
  description: string;
  templateInfo: TemplateInfo;
}

export interface SetResponseGeneratorFromTemplateCommandResponse {
  nodeId: string;
  nodeVersion: number;
}

export async function setPredicateNodeResponseGeneratorFromTemplateHandler(
  command: SetResponseGeneratorFromTemplateCommand,
): Promise<SetResponseGeneratorFromTemplateCommandResponse> {
  const node = await predicateNodeRepo.query.byId(command.nodeId);

  if (Array.isArray(node.childNodeIdsOrResponseGenerator) && node.childNodeIdsOrResponseGenerator.length > 0) {
    throw failure(`Cannot set response generator for predicate node ${node.id} since it already has child nodes!`);
  }

  const newVersion = await predicateNodeRepo.patch(
    command.nodeId,
    command.unmodifiedNodeVersion,
    {},
    predicateNodeRepo.createDomainEvent(
      'ResponseGeneratorSetFromTemplate',
      command.nodeId,
      {
        name: command.name,
        description: command.description,
        templateInfo: command.templateInfo,
      },
    ),
  );

  return {
    nodeId: command.nodeId,
    nodeVersion: newVersion,
  };
}

export const setPredicateNodeResponseGeneratorFromTemplate = createCommandFn<SetResponseGeneratorFromTemplateCommand>('set-response-generator-from-template');

// TODO: validate
export const setPredicateNodeResponseGeneratorFromTemplateConstraints: CommandValidationConstraints<SetResponseGeneratorFromTemplateCommand> = {
  nodeId: {},
  unmodifiedNodeVersion: {},
  name: {},
  description: {},
  templateInfo: {},
};
