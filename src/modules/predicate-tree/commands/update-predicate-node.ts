import { CommandValidationConstraints } from '../../../api-infrastructure';
import { omit } from '../../../util';
import { predicateNodeRepo } from '../predicate-node.repo';
import { UpdatePredicateNodeCommand } from '../predicate-node.types';

export async function updatePredicateNode(command: UpdatePredicateNodeCommand) {
  const newVersion = await predicateNodeRepo.patch(
    command.nodeId,
    command.unmodifiedNodeVersion,
    {
      ...omit(command, 'nodeId', 'unmodifiedNodeVersion', 'parameterValuesOrEvalFunctionBody'),
      templateInfoOrEvalFunctionBody:
        typeof command.parameterValuesOrEvalFunctionBody === 'string'
          ? command.parameterValuesOrEvalFunctionBody
          : undefined, // TODO: patch parameter values once method accepts deep partial args
    },
  );

  return {
    nodeId: command.nodeId,
    nodeVersion: newVersion,
  };
}

// TODO: validate
export const updatePredicateNodeConstraints: CommandValidationConstraints<UpdatePredicateNodeCommand> = {
  nodeId: {},
  unmodifiedNodeVersion: {},
  name: {},
  description: {},
  parameterValuesOrEvalFunctionBody: {},
};
