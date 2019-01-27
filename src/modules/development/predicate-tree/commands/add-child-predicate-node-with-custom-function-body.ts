import { CommandValidationConstraints } from 'src/api-infrastructure';
import { failure } from 'src/util';
import { predicateNodeRepo } from '../predicate-node.repo';
import { AddChildPredicateNodeWithCustomFunctionBodyCommand } from '../predicate-node.types';

export async function addChildPredicateNodeWithCustomFunctionBody(command: AddChildPredicateNodeWithCustomFunctionBodyCommand) {
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

// TODO: validate
// tslint:disable-next-line:max-line-length
export const addChildPredicateNodeWithCustomFunctionBodyConstraints: CommandValidationConstraints<AddChildPredicateNodeWithCustomFunctionBodyCommand> = {
  parentNodeId: {},
  name: {},
  description: {},
  evalFunctionBody: {},
};
