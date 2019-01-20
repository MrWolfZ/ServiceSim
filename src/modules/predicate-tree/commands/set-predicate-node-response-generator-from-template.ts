import { CommandValidationConstraints } from '../../../api-infrastructure';
import { failure } from '../../../util';
import { predicateNodeRepo } from '../predicate-node.repo';
import { SetResponseGeneratorFromTemplateCommand } from '../predicate-node.types';

export async function setPredicateNodeResponseGeneratorFromTemplate(command: SetResponseGeneratorFromTemplateCommand) {
  const node = await predicateNodeRepo.query.byId(command.nodeId);

  if (Array.isArray(node.childNodeIdsOrResponseGenerator) && node.childNodeIdsOrResponseGenerator.length > 0) {
    throw failure(`Cannot set response generator for predicate node ${node.id} since it already has child nodes!`);
  }

  const newVersion = await predicateNodeRepo.patch(
    command.nodeId,
    command.unmodifiedNodeVersion,
    {},
    predicateNodeRepo.createDomainEvent(
      'ResponseGeneratorSetFromTemplate',
      {
        name: command.name,
        description: command.description,
        templateInfo: command.templateInfo,
      },
    ),
  );

  return {
    nodeId: command.nodeId,
    nodeVersion: newVersion,
  };
}

// TODO: validate
export const setPredicateNodeResponseGeneratorFromTemplateConstraints: CommandValidationConstraints<SetResponseGeneratorFromTemplateCommand> = {
  nodeId: {},
  unmodifiedNodeVersion: {},
  name: {},
  description: {},
  templateInfo: {},
};
