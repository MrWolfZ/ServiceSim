import { CommandValidationConstraints } from '../../../api-infrastructure';
import { failure } from '../../../util';
import { predicateNodeRepo } from '../predicate-node.repo';
import { SetResponseGeneratorCommand } from '../predicate-node.types';

export async function setPredicateNodeResponseGenerator(command: SetResponseGeneratorCommand) {
  const node = await predicateNodeRepo.query.byId(command.nodeId);

  if (Array.isArray(node.childNodeIdsOrResponseGenerator) && node.childNodeIdsOrResponseGenerator.length > 0) {
    throw failure(`Cannot set response generator for predicate node ${node.id} since it already has child nodes!`);
  }

  const newVersion = await predicateNodeRepo.patch(
    command.nodeId,
    command.unmodifiedNodeVersion,
    {},
    predicateNodeRepo.createDomainEvent(
      'ResponseGeneratorSet',
      {
        responseGenerator: {
          name: command.name,
          description: command.description,
          templateInfoOrGeneratorFunctionBody: command.templateInfoOrGeneratorFunctionBody,
        },
      },
    ),
  );

  return {
    nodeId: command.nodeId,
    nodeVersion: newVersion,
  };
}

// TODO: validate
export const setPredicateNodeResponseGeneratorConstraints: CommandValidationConstraints<SetResponseGeneratorCommand> = {
  nodeId: {},
  unmodifiedNodeVersion: {},
  name: {},
  description: {},
  templateInfoOrGeneratorFunctionBody: {},
};
