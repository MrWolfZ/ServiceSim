import express from 'express';
import { commandHandler, CommandHandler, createDomainEvent, DB, queryHandler } from '../../api-infrastructure';
import { failure } from '../../util/result-monad';
import { omit } from '../../util/util';
import { getPredicateTemplatesByIdsAndVersions } from '../predicate-template/predicate-template.api';
import { getResponseGeneratorTemplatesByIdsAndVersions } from '../response-generator-template/response-generator-template.api';
import {
  CreatePredicateNodeCommand,
  DeletePredicateNodeCommand,
  PredicateNodeDto,
  PredicateNodeEntityDefinition,
  ResponseGeneratorData,
  ResponseGeneratorDataWithTemplateSnapshot,
  RootNodeName,
  SetResponseGeneratorCommand,
  TemplateInfo,
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

    ResponseGeneratorSet: (entity, evt) => {
      return {
        ...entity,
        childNodeIdsOrResponseGenerator: {
          name: evt.responseGenerator.name,
          description: evt.responseGenerator.description,
          templateInfoOrGeneratorFunctionBody: evt.responseGenerator.templateInfoOrGeneratorFunctionBody,
        },
      };
    },
  },
};

export async function getAllPredicateNodes() {
  const allNodes = await DB.query(PREDICATE_NODE_ENTITY_DEFINITION).allAsync();
  const allReferencedPredicateTemplateIdsAndVersions = allNodes
    .filter(n => typeof n.templateInfoOrEvalFunctionBody !== 'string')
    .map(n => n.templateInfoOrEvalFunctionBody as TemplateInfo)
    .reduce((agg, ti) => {
      agg[ti.templateId] = agg[ti.templateId] || [];

      if (!agg[ti.templateId].includes(ti.templateVersion)) {
        agg[ti.templateId].push(ti.templateVersion);
      }

      return agg;
    }, {} as { [templateId: string]: number[] });

  const allReferencedPredicateTemplates = await getPredicateTemplatesByIdsAndVersions(allReferencedPredicateTemplateIdsAndVersions);

  const allReferencedResponseGeneratorTemplateIdsAndVersions = allNodes
    .filter(n => !Array.isArray(n.childNodeIdsOrResponseGenerator) && typeof n.templateInfoOrEvalFunctionBody !== 'string')
    .map(n => (n.childNodeIdsOrResponseGenerator as ResponseGeneratorData).templateInfoOrGeneratorFunctionBody as TemplateInfo)
    .reduce((agg, ti) => {
      agg[ti.templateId] = agg[ti.templateId] || [];

      if (!agg[ti.templateId].includes(ti.templateVersion)) {
        agg[ti.templateId].push(ti.templateVersion);
      }

      return agg;
    }, {} as { [templateId: string]: number[] });

  const allReferencedResponseGeneratorTemplates = await getResponseGeneratorTemplatesByIdsAndVersions(allReferencedResponseGeneratorTemplateIdsAndVersions);

  return allNodes.map<PredicateNodeDto>(n => {
    let templateInfoOrEvalFunctionBody: PredicateNodeDto['templateInfoOrEvalFunctionBody'];

    if (typeof n.templateInfoOrEvalFunctionBody === 'string') {
      templateInfoOrEvalFunctionBody = n.templateInfoOrEvalFunctionBody;
    } else {
      const templateId = n.templateInfoOrEvalFunctionBody.templateId;
      const templateVersion = n.templateInfoOrEvalFunctionBody.templateVersion;
      const template = allReferencedPredicateTemplates.find(t => t.id === templateId && t.version === templateVersion)!;

      templateInfoOrEvalFunctionBody = {
        templateId,
        templateVersion,
        parameterValues: n.templateInfoOrEvalFunctionBody.parameterValues,
        templateDataSnapshot: omit(template, 'id', 'version'),
      };
    }

    let childNodeIdsOrResponseGenerator: PredicateNodeDto['childNodeIdsOrResponseGenerator'];

    if (Array.isArray(n.childNodeIdsOrResponseGenerator)) {
      childNodeIdsOrResponseGenerator = n.childNodeIdsOrResponseGenerator;
    } else {
      let templateInfoOrGeneratorFunctionBody: ResponseGeneratorDataWithTemplateSnapshot['templateInfoOrGeneratorFunctionBody'];

      if (typeof n.childNodeIdsOrResponseGenerator.templateInfoOrGeneratorFunctionBody === 'string') {
        templateInfoOrGeneratorFunctionBody = n.childNodeIdsOrResponseGenerator.templateInfoOrGeneratorFunctionBody;
      } else {
        const templateId = n.childNodeIdsOrResponseGenerator.templateInfoOrGeneratorFunctionBody.templateId;
        const templateVersion = n.childNodeIdsOrResponseGenerator.templateInfoOrGeneratorFunctionBody.templateVersion;
        const template = allReferencedResponseGeneratorTemplates.find(t => t.id === templateId && t.version === templateVersion)!;

        templateInfoOrGeneratorFunctionBody = {
          templateId,
          templateVersion,
          parameterValues: n.childNodeIdsOrResponseGenerator.templateInfoOrGeneratorFunctionBody.parameterValues,
          templateDataSnapshot: omit(template, 'id', 'version'),
        };
      }

      childNodeIdsOrResponseGenerator = {
        name: n.childNodeIdsOrResponseGenerator.name,
        description: n.childNodeIdsOrResponseGenerator.description,
        templateInfoOrGeneratorFunctionBody,
      };
    }

    return {
      id: n.id,
      version: n.$metadata.version,
      name: n.name,
      description: n.description,
      templateInfoOrEvalFunctionBody,
      childNodeIdsOrResponseGenerator,
    };
  });
}

type PredicateNodeCommandHandler<TCommand> = CommandHandler<TCommand, {
  nodeId: string;
  nodeVersion: number;
}>;

export const ensureRootPredicateNodeExists: CommandHandler<void, { nodeId: string }> = async () => {
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

export const addChildPredicateNode: PredicateNodeCommandHandler<CreatePredicateNodeCommand> = async command => {
  const parentNode = await DB.query(PREDICATE_NODE_ENTITY_DEFINITION).byIdAsync(command.parentNodeId);

  if (!Array.isArray(parentNode.childNodeIdsOrResponseGenerator)) {
    throw failure(`Cannot add child predicate node for predicate node ${parentNode.id} since it already has a response generator set!`);
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
addChildPredicateNode.constraints = {
  name: {},
  description: {},
  templateInfoOrEvalFunctionBody: {},
};

export const updatePredicateNode: PredicateNodeCommandHandler<UpdatePredicateNodeCommand> = async command => {
  const newVersion = await DB.patchAsync(
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

  return {
    nodeId: command.nodeId,
    nodeVersion: newVersion,
  };
};

// TODO: validate
updatePredicateNode.constraints = {
  nodeId: {},
  unmodifiedNodeVersion: {},
  name: {},
  description: {},
  parameterValuesOrEvalFunctionBody: {},
};

export const setPredicateNodeResponseGenerator: PredicateNodeCommandHandler<SetResponseGeneratorCommand> = async command => {
  const node = await DB.query(PREDICATE_NODE_ENTITY_DEFINITION).byIdAsync(command.nodeId);

  if (Array.isArray(node.childNodeIdsOrResponseGenerator) && node.childNodeIdsOrResponseGenerator.length > 0) {
    throw failure(`Cannot set response generator for predicate node ${node.id} since it already has child nodes!`);
  }

  const newVersion = await DB.patchAsync(
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

  return {
    nodeId: command.nodeId,
    nodeVersion: newVersion,
  };
};

// TODO: validate
setPredicateNodeResponseGenerator.constraints = {
  nodeId: {},
  unmodifiedNodeVersion: {},
  name: {},
  description: {},
  templateInfoOrGeneratorFunctionBody: {},
};

export const deletePredicateNode: CommandHandler<DeletePredicateNodeCommand> = async command => {
  return await DB.deleteAsync(PREDICATE_NODE_ENTITY_DEFINITION, command.nodeId, command.unmodifiedNodeVersion);
};

// TODO: validate
deletePredicateNode.constraints = {
  nodeId: {},
  unmodifiedNodeVersion: {},
};

export const dropAllPredicateNodes: CommandHandler = async () => {
  await DB.dropAllAsync(PREDICATE_NODE_ENTITY_DEFINITION.entityType);
};

export const predicateNodeApi = express.Router()
  .get('/', queryHandler(getAllPredicateNodes))
  .post('/addChildNode', commandHandler(addChildPredicateNode))
  .post('/update', commandHandler(updatePredicateNode))
  .post('/setResponseGenerator', commandHandler(setPredicateNodeResponseGenerator))
  .post('/delete', commandHandler(deletePredicateNode));
