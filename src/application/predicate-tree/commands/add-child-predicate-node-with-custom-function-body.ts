import { Command, CommandValidationConstraints, createCommandFn } from 'src/infrastructure/cqrs';
import { failure } from 'src/util';
import { predicateNodeRepo } from '../predicate-node.repo';

export type AddChildPredicateNodeWithCustomFunctionBodyCommandType = 'add-child-predicate-node-with-custom-function-body';

export interface AddChildPredicateNodeWithCustomFunctionBodyCommand
  extends Command<AddChildPredicateNodeWithCustomFunctionBodyCommandType, AddChildPredicateNodeWithCustomFunctionBodyCommandResponse> {
  parentNodeId: string;
  name: string;
  description: string;
  evalFunctionBody: string;
}

export interface AddChildPredicateNodeWithCustomFunctionBodyCommandResponse {
  nodeId: string;
  nodeVersion: number;
}

export async function addChildPredicateNodeWithCustomFunctionBodyHandler(
  command: AddChildPredicateNodeWithCustomFunctionBodyCommand,
): Promise<AddChildPredicateNodeWithCustomFunctionBodyCommandResponse> {
  const parentNode = await predicateNodeRepo.query.byId(command.parentNodeId);

  if (!Array.isArray(parentNode.childNodeIdsOrResponseGenerator)) {
    throw failure(`Cannot add child predicate node for predicate node ${parentNode.id} since it already has a response generator set!`);
  }

  const newNode = await predicateNodeRepo.create({
    name: command.name,
    description: command.description,
    templateInfoOrEvalFunctionBody: command.evalFunctionBody,
    childNodeIdsOrResponseGenerator: [],
  });

  await predicateNodeRepo.patch(
    parentNode.id,
    parentNode.$metadata.version,
    {},
    predicateNodeRepo.createDomainEvent(
      'ChildPredicateNodeAdded',
      parentNode.id,
      {
        childNodeId: newNode.id,
      },
    ),
  );

  return {
    nodeId: newNode.id,
    nodeVersion: 1,
  };
}

export const addChildPredicateNodeWithCustomFunctionBody =
  createCommandFn<AddChildPredicateNodeWithCustomFunctionBodyCommand>('add-child-predicate-node-with-custom-function-body');

// TODO: validate
// tslint:disable-next-line:max-line-length
export const addChildPredicateNodeWithCustomFunctionBodyConstraints: CommandValidationConstraints<AddChildPredicateNodeWithCustomFunctionBodyCommand> = {
  parentNodeId: {},
  name: {},
  description: {},
  evalFunctionBody: {},
};
