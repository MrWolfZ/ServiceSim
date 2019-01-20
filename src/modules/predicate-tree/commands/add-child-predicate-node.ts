import { CommandValidationConstraints } from '../../../api-infrastructure';
import { failure, omit } from '../../../util';
import { predicateNodeRepo } from '../predicate-node.repo';
import { AddChildPredicateNodeCommand } from '../predicate-node.types';

export async function addChildPredicateNode(command: AddChildPredicateNodeCommand) {
  const parentNode = await predicateNodeRepo.query.byId(command.parentNodeId);

  if (!Array.isArray(parentNode.childNodeIdsOrResponseGenerator)) {
    throw failure(`Cannot add child predicate node for predicate node ${parentNode.id} since it already has a response generator set!`);
  }

  const newNode = await predicateNodeRepo.create({
    ...omit(command, 'parentNodeId'),
    childNodeIdsOrResponseGenerator: [],
  });

  await predicateNodeRepo.patch(
    parentNode.id,
    parentNode.$metadata.version,
    {},
    predicateNodeRepo.createDomainEvent(
      'ChildPredicateNodeAdded',
      {
        aggregateId: parentNode.id,
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
export const addChildPredicateNodeConstraints: CommandValidationConstraints<AddChildPredicateNodeCommand> = {
  parentNodeId: {},
  name: {},
  description: {},
  templateInfoOrEvalFunctionBody: {},
};
