import { CommandValidationConstraints } from '../../../../api-infrastructure';
import { failure } from '../../../../util';
import { predicateNodeRepo } from '../predicate-node.repo';
import { SetResponseGeneratorWithCustomBodyCommand } from '../predicate-node.types';

export async function setPredicateNodeResponseGeneratorWithCustomBody(command: SetResponseGeneratorWithCustomBodyCommand) {
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

// TODO: validate
export const setPredicateNodeResponseGeneratorWithCustomBodyConstraints: CommandValidationConstraints<SetResponseGeneratorWithCustomBodyCommand> = {
  nodeId: {},
  unmodifiedNodeVersion: {},
  name: {},
  description: {},
  generatorFunctionBody: {},
};
