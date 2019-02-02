import { CommandValidationConstraints } from 'src/infrastructure/cqrs';
import { predicateNodeRepo } from '../predicate-node.repo';
import { DeletePredicateNodeCommand } from '../predicate-node.types';

export async function deletePredicateNode(command: DeletePredicateNodeCommand) {
  return await predicateNodeRepo.delete(command.nodeId, command.unmodifiedNodeVersion);
}

// TODO: validate
export const deletePredicateNodeConstraints: CommandValidationConstraints<DeletePredicateNodeCommand> = {
  nodeId: {},
  unmodifiedNodeVersion: {},
};
