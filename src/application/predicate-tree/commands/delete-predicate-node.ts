import { Command, createCommandFn } from 'src/application/infrastructure/cqrs';
import { CommandValidationConstraints } from 'src/infrastructure/cqrs';
import { predicateNodeRepo } from '../predicate-node.repo';

export type DeletePredicateNodeCommandType = 'delete-predicate-node';

export interface DeletePredicateNodeCommand extends Command<DeletePredicateNodeCommandType> {
  nodeId: string;
  unmodifiedNodeVersion: number;
}

export async function deletePredicateNodeHandler(command: DeletePredicateNodeCommand) {
  return await predicateNodeRepo.delete(command.nodeId, command.unmodifiedNodeVersion);
}

export const deletePredicateNode = createCommandFn<DeletePredicateNodeCommand>('delete-predicate-node');

// TODO: validate
export const deletePredicateNodeConstraints: CommandValidationConstraints<DeletePredicateNodeCommand> = {
  nodeId: {},
  unmodifiedNodeVersion: {},
};
