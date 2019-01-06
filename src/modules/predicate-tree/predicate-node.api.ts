import express from 'express';
import { commandHandler, CommandHandler, createDomainEvent, DB, queryHandler } from '../../api-infrastructure';
import { failure, isFailure } from '../../util/result-monad';
import { omit } from '../../util/util';
import {
  CreatePredicateNodeCommand,
  DeletePredicateNodeCommand,
  PredicateNodeDto,
  PredicateNodeEntityDefinition,
  RootNodeName,
  SetResponseGeneratorCommand,
  UpdatePredicateNodeCommand,
} from './predicate-node.types';

export const PREDICATE_NODE_ENTITY_DEFINITION: PredicateNodeEntityDefinition = {
  entityType: 'predicate-node',
  '@': 'EventDrivenRootEntityDefinition',
  eventHandlers: {
    ChildPredicateNodeAdded: (entity, evt) => {
      return {
        ...entity,
        childNodeIdsOrResponseGenerator: [...entity.childNodeIdsOrResponseGenerator as string[], evt.childNodeId],
      };
    },

    ResponseGeneratorSet: (entity, _) => {
      // TODO: move validation to command handler
      if (Array.isArray(entity.childNodeIdsOrResponseGenerator) && entity.childNodeIdsOrResponseGenerator.length > 0) {
        throw new Error(`Cannot set response generator for predicate node ${entity.id} since it already has child nodes!`);
      }

      // TODO: implement
      return entity;
    },
  },
};

export async function getAllAsync() {
  const allTemplates = await DB.query(PREDICATE_NODE_ENTITY_DEFINITION).allAsync();

  // TODO: load templates in correct versions and apply data to DTOs

  return allTemplates.map<PredicateNodeDto>(n => ({
    id: n.id,
    version: n.$metadata.version,
    name: n.name,
    description: n.description,
    templateInfoOrEvalFunctionBody: undefined!,
    childNodeIdsOrResponseGenerator: [],
  }));
}

type PredicateTemplateCommandHandler<TCommand> = CommandHandler<TCommand, {
  nodeId: string;
  nodeVersion: number;
}>;

export const ensureRootNodeExistsAsync: CommandHandler<void, { nodeId: string }> = async () => {
  const rootNodeName: RootNodeName = 'ROOT';

  const rootNodes = (await DB.query(PREDICATE_NODE_ENTITY_DEFINITION).byPropertiesAsync({ name: rootNodeName }));

  let rootNode = rootNodes[0];

  if (rootNodes.length === 0) {
    rootNode = await DB.createAsync(PREDICATE_NODE_ENTITY_DEFINITION, {
      name: rootNodeName,
      description: 'Root node of the predicate tree. This node should never be exposed to the user directly.',
      templateInfoOrEvalFunctionBody: 'return true;',
      childNodeIdsOrResponseGenerator: [],
    });
  }

  return {
    nodeId: rootNode.id,
  };
};

export const createAsync: PredicateTemplateCommandHandler<CreatePredicateNodeCommand> = async command => {
  const parentNodeResult = await DB.query(PREDICATE_NODE_ENTITY_DEFINITION).byIdAsync(command.parentNodeId);

  if (isFailure(parentNodeResult)) {
    return parentNodeResult;
  }

  const parentNode = parentNodeResult.success;

  if (!Array.isArray(parentNode.childNodeIdsOrResponseGenerator)) {
    return failure([`Cannot add child predicate node for predicate node ${parentNode.id} since it already has a response generator set!`]);
  }

  const newNode = await DB.createAsync(PREDICATE_NODE_ENTITY_DEFINITION, {
    ...omit(command, 'parentNodeId'),
    childNodeIdsOrResponseGenerator: [],
  });

  await DB.patchAsync(
    PREDICATE_NODE_ENTITY_DEFINITION,
    parentNode.id,
    parentNode.$metadata.version,
    {},
    createDomainEvent(
      PREDICATE_NODE_ENTITY_DEFINITION,
      'ChildPredicateNodeAdded',
      {
        rootEntityId: parentNode.id,
        childNodeId: newNode.id,
      },
    ),
  );

  return {
    nodeId: newNode.id,
    nodeVersion: newNode.$metadata.version,
  };
};

// TODO: validate
createAsync.constraints = {
  name: {},
  description: {},
  templateInfoOrEvalFunctionBody: {},
};

export const updateAsync: PredicateTemplateCommandHandler<UpdatePredicateNodeCommand> = async command => {
  const result = await DB.patchAsync(
    PREDICATE_NODE_ENTITY_DEFINITION,
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

  if (isFailure(result)) {
    return result;
  }

  return {
    nodeId: command.nodeId,
    nodeVersion: result.success,
  };
};

// TODO: validate
updateAsync.constraints = {
  nodeId: {},
  unmodifiedNodeVersion: {},
  name: {},
  description: {},
  parameterValuesOrEvalFunctionBody: {},
};

export const setResponseGeneratorAsync: PredicateTemplateCommandHandler<SetResponseGeneratorCommand> = async command => {
  const result = await DB.patchAsync(
    PREDICATE_NODE_ENTITY_DEFINITION,
    command.nodeId,
    command.unmodifiedNodeVersion,
    {},
    createDomainEvent(
      PREDICATE_NODE_ENTITY_DEFINITION,
      'ResponseGeneratorSet',
      {
        rootEntityId: command.nodeId,
        responseGenerator: {
          name: command.name,
          description: command.description,
          templateInfoOrGeneratorFunctionBody: command.templateInfoOrGeneratorFunctionBody,
        },
      },
    ),
  );

  if (isFailure(result)) {
    return result;
  }

  return {
    nodeId: command.nodeId,
    nodeVersion: result.success,
  };
};

// TODO: validate
setResponseGeneratorAsync.constraints = {
  nodeId: {},
  unmodifiedNodeVersion: {},
  name: {},
  description: {},
  templateInfoOrGeneratorFunctionBody: {},
};

export const deleteAsync: CommandHandler<DeletePredicateNodeCommand> = async command => {
  return await DB.deleteAsync(PREDICATE_NODE_ENTITY_DEFINITION, command.nodeId, command.unmodifiedNodeVersion);
};

// TODO: validate
deleteAsync.constraints = {
  nodeId: {},
  unmodifiedNodeVersion: {},
};

export const dropAllAsync: CommandHandler = async () => {
  await DB.dropAllAsync(PREDICATE_NODE_ENTITY_DEFINITION.entityType);
};

export const api = express.Router();
api.get('/', queryHandler(getAllAsync));
api.post('/create', commandHandler(createAsync));
api.post('/update', commandHandler(updateAsync));
api.post('/setResponseGenerator', commandHandler(setResponseGeneratorAsync));
api.post('/delete', commandHandler(deleteAsync));
