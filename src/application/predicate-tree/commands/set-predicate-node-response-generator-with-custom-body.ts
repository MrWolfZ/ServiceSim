import { Command, createCommandFn } from 'src/application/infrastructure/cqrs';
import { CommandValidationConstraints } from 'src/infrastructure/cqrs';
import { failure } from 'src/util';
import { predicateNodeRepo } from '../predicate-node.repo';

export type SetResponseGeneratorWithCustomBodyCommandType = 'set-response-generator-with-custom-body';

export interface SetResponseGeneratorWithCustomBodyCommand
  extends Command<SetResponseGeneratorWithCustomBodyCommandType, SetResponseGeneratorWithCustomBodyCommandResponse> {
  nodeId: string;
  unmodifiedNodeVersion: number;
  name: string;
  description: string;
  generatorFunctionBody: string;
}

export interface SetResponseGeneratorWithCustomBodyCommandResponse {
  nodeId: string;
  nodeVersion: number;
}

export async function setPredicateNodeResponseGeneratorWithCustomBodyHandler(command: SetResponseGeneratorWithCustomBodyCommand) {
  const node = await predicateNodeRepo.query.byId(command.nodeId);

  if (Array.isArray(node.childNodeIdsOrResponseGenerator) && node.childNodeIdsOrResponseGenerator.length > 0) {
    throw failure(`Cannot set response generator for predicate node ${node.id} since it already has child nodes!`);
  }

  const newVersion = await predicateNodeRepo.patch(
    command.nodeId,
    command.unmodifiedNodeVersion,
    {},
    predicateNodeRepo.createDomainEvent(
      'ResponseGeneratorSetWithCustomBody',
      command.nodeId,
      {
        name: command.name,
        description: command.description,
        generatorFunctionBody: command.generatorFunctionBody as string,
      },
    ),
  );

  return {
    nodeId: command.nodeId,
    nodeVersion: newVersion,
  };
}

export const setPredicateNodeResponseGeneratorWithCustomBody =
  createCommandFn<SetResponseGeneratorWithCustomBodyCommand>('set-response-generator-with-custom-body');

// TODO: validate
export const setPredicateNodeResponseGeneratorWithCustomBodyConstraints: CommandValidationConstraints<SetResponseGeneratorWithCustomBodyCommand> = {
  nodeId: {},
  unmodifiedNodeVersion: {},
  name: {},
  description: {},
  generatorFunctionBody: {},
};
