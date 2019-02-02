import { Command, createCommandFn } from 'src/application/infrastructure/cqrs';
import { CommandValidationConstraints } from 'src/infrastructure/cqrs';
import { predicateNodeRepo } from '../predicate-node.repo';

export type UpdatePredicateNodeCommandType = 'update-predicate-node';

export interface UpdatePredicateNodeCommand
  extends Command<UpdatePredicateNodeCommandType, UpdatePredicateNodeCommandResponse> {
  nodeId: string;
  unmodifiedNodeVersion: number;
  name?: string;
  description?: string;
  parameterValuesOrEvalFunctionBody: { [prop: string]: string | number | boolean } | string;
}

export interface UpdatePredicateNodeCommandResponse {
  nodeId: string;
  nodeVersion: number;
}

export async function updatePredicateNodeHandler(command: UpdatePredicateNodeCommand): Promise<UpdatePredicateNodeCommandResponse> {
  const { nodeId, unmodifiedNodeVersion, parameterValuesOrEvalFunctionBody, ...data } = command;

  const newVersion = await predicateNodeRepo.patch(
    command.nodeId,
    command.unmodifiedNodeVersion,
    {
      ...data,
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

export const updatePredicateNode = createCommandFn<UpdatePredicateNodeCommand>('update-predicate-node');

// TODO: validate
export const updatePredicateNodeConstraints: CommandValidationConstraints<UpdatePredicateNodeCommand> = {
  nodeId: {},
  unmodifiedNodeVersion: {},
  name: {},
  description: {},
  parameterValuesOrEvalFunctionBody: {},
};
