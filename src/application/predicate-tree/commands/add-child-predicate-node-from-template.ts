import { Command, createCommandFn } from 'src/application/infrastructure/cqrs';
import { TemplateInfo } from 'src/domain/predicate-tree';
import { CommandValidationConstraints } from 'src/infrastructure/cqrs';
import { failure } from 'src/util';
import { predicateNodeRepo } from '../predicate-node.repo';

export type AddChildPredicateNodeFromTemplateCommandType = 'add-child-predicate-node-from-template';

export interface AddChildPredicateNodeFromTemplateCommand
  extends Command<AddChildPredicateNodeFromTemplateCommandType, AddChildPredicateNodeFromTemplateCommandResponse> {
  parentNodeId: string;
  name: string;
  description: string;
  templateInfo: TemplateInfo;
}

export interface AddChildPredicateNodeFromTemplateCommandResponse {
  nodeId: string;
  nodeVersion: number;
}

export async function addChildPredicateNodeFromTemplateHandler(
  command: AddChildPredicateNodeFromTemplateCommand,
): Promise<AddChildPredicateNodeFromTemplateCommandResponse> {
  const parentNode = await predicateNodeRepo.query.byId(command.parentNodeId);

  if (!Array.isArray(parentNode.childNodeIdsOrResponseGenerator)) {
    throw failure(`Cannot add child predicate node for predicate node ${parentNode.id} since it already has a response generator set!`);
  }

  const newNode = await predicateNodeRepo.create({
    name: command.name,
    description: command.description,
    templateInfoOrEvalFunctionBody: command.templateInfo,
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

export const addChildPredicateNodeFromTemplate = createCommandFn<AddChildPredicateNodeFromTemplateCommand>('add-child-predicate-node-from-template');

// TODO: validate
// tslint:disable-next-line:max-line-length
export const addChildPredicateNodeFromTemplateConstraints: CommandValidationConstraints<AddChildPredicateNodeFromTemplateCommand> = {
  parentNodeId: {},
  name: {},
  description: {},
  templateInfo: {},
};
