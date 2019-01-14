import express from 'express';
import { commandHandler, CommandValidationConstraints, eventDrivenRepository, queryHandler } from '../../api-infrastructure';
import { failure, omit } from '../../util';
import { getPredicateTemplatesByIdsAndVersions } from '../predicate-template/queries/get-predicate-templates-by-ids-and-versions';
import { getResponseGeneratorTemplatesByIdsAndVersions } from '../response-generator-template/response-generator-template.api';
import {
  CreatePredicateNodeCommand as AddChildPredicateNodeCommand,
  DeletePredicateNodeCommand,
  PredicateNodeAggregate,
  PredicateNodeDomainEvents,
  PredicateNodeDto,
  ResponseGeneratorData,
  ResponseGeneratorDataWithTemplateSnapshot,
  RootNodeName,
  SetResponseGeneratorCommand,
  TemplateInfo,
  UpdatePredicateNodeCommand,
} from './predicate-node.types';

const repo = eventDrivenRepository<PredicateNodeAggregate, PredicateNodeDomainEvents>('predicate-node', {
  ChildPredicateNodeAdded: (aggregate, evt) => {
    return {
      ...aggregate,
      childNodeIdsOrResponseGenerator: [...aggregate.childNodeIdsOrResponseGenerator as string[], evt.childNodeId],
    };
  },

  ResponseGeneratorSet: (aggregate, evt) => {
    return {
      ...aggregate,
      childNodeIdsOrResponseGenerator: {
        name: evt.responseGenerator.name,
        description: evt.responseGenerator.description,
        templateInfoOrGeneratorFunctionBody: evt.responseGenerator.templateInfoOrGeneratorFunctionBody,
      },
    };
  },
});

export async function getAllPredicateNodes() {
  const allNodes = await repo.query.all();
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

  const [
    allReferencedPredicateTemplates,
    allReferencedResponseGeneratorTemplates,
  ] = await Promise.all([
    getPredicateTemplatesByIdsAndVersions(allReferencedPredicateTemplateIdsAndVersions),
    getResponseGeneratorTemplatesByIdsAndVersions(allReferencedResponseGeneratorTemplateIdsAndVersions),
  ]);

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

export async function ensureRootPredicateNodeExists() {
  const rootNodeName: RootNodeName = 'ROOT';

  const rootNodes = (await repo.query.byProperties({ name: rootNodeName }));

  if (rootNodes.length > 0) {
    return {
      nodeId: rootNodes[0].id,
    };
  }

  const rootNode = await repo.create({
    name: rootNodeName,
    description: 'Root node of the predicate tree. This node should never be exposed to the user directly.',
    templateInfoOrEvalFunctionBody: 'return true;',
    childNodeIdsOrResponseGenerator: [],
  });

  return {
    nodeId: rootNode.id,
  };
}

export async function addChildPredicateNode(command: AddChildPredicateNodeCommand) {
  const parentNode = await repo.query.byId(command.parentNodeId);

  if (!Array.isArray(parentNode.childNodeIdsOrResponseGenerator)) {
    throw failure(`Cannot add child predicate node for predicate node ${parentNode.id} since it already has a response generator set!`);
  }

  const newNode = await repo.create({
    ...omit(command, 'parentNodeId'),
    childNodeIdsOrResponseGenerator: [],
  });

  await repo.patch(
    parentNode.id,
    parentNode.$metadata.version,
    {},
    repo.createDomainEvent(
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

export async function updatePredicateNode(command: UpdatePredicateNodeCommand) {
  const newVersion = await repo.patch(
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

export async function setPredicateNodeResponseGenerator(command: SetResponseGeneratorCommand) {
  const node = await repo.query.byId(command.nodeId);

  if (Array.isArray(node.childNodeIdsOrResponseGenerator) && node.childNodeIdsOrResponseGenerator.length > 0) {
    throw failure(`Cannot set response generator for predicate node ${node.id} since it already has child nodes!`);
  }

  const newVersion = await repo.patch(
    command.nodeId,
    command.unmodifiedNodeVersion,
    {},
    repo.createDomainEvent(
      'ResponseGeneratorSet',
      {
        aggregateId: command.nodeId,
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

export async function deletePredicateNode(command: DeletePredicateNodeCommand) {
  return await repo.delete(command.nodeId, command.unmodifiedNodeVersion);
}

// TODO: validate
export const deletePredicateNodeConstraints: CommandValidationConstraints<DeletePredicateNodeCommand> = {
  nodeId: {},
  unmodifiedNodeVersion: {},
};

export async function dropAllPredicateNodes() {
  await repo.dropAll();
}

export const predicateNodeApi = express.Router()
  .get('/', queryHandler(getAllPredicateNodes))
  .post('/addChildNode', commandHandler(addChildPredicateNode, addChildPredicateNodeConstraints))
  .post('/update', commandHandler(updatePredicateNode, updatePredicateNodeConstraints))
  .post('/setResponseGenerator', commandHandler(setPredicateNodeResponseGenerator, setPredicateNodeResponseGeneratorConstraints))
  .post('/delete', commandHandler(deletePredicateNode, deletePredicateNodeConstraints));
