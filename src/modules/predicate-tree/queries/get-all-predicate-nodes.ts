import { createDataEventHandler, createEventHandler, getDomainAndDataEventStreamWithReplay } from '../../../api-infrastructure';
import { DataEvents, VersionedAggregateMetadata } from '../../../api-infrastructure/api-infrastructure.types';
import { applyDiff, checkExactArray, createExactArray, omit } from '../../../util';
import { PredicateTemplateAggregate } from '../../predicate-template/predicate-template.types';
import { getPredicateTemplatesByIdsAndVersions } from '../../predicate-template/queries/get-predicate-templates-by-ids-and-versions';
import { getResponseGeneratorTemplatesByIdsAndVersions } from '../../response-generator-template/response-generator-template.api';
import { ResponseGeneratorTemplateAggregate } from '../../response-generator-template/response-generator-template.types';
import { predicateNodeRepo } from '../predicate-node.repo';
import {
  ChildPredicateNodeAdded,
  PredicateNodeAggregate,
  PredicateNodeDto,
  ResponseGeneratorData,
  ResponseGeneratorDataWithTemplateSnapshot,
  ResponseGeneratorSet,
  TemplateInfo,
} from '../predicate-node.types';

let response: PredicateNodeDto[] = [];

export async function getAllPredicateNodes2() {
  return response;
}

export async function getAllPredicateNodes() {
  const allNodes = await predicateNodeRepo.query.all();
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

type SubscribedAggregates =
  | PredicateTemplateAggregate
  | ResponseGeneratorTemplateAggregate
  | PredicateNodeAggregate
  ;

type Metadata = VersionedAggregateMetadata<SubscribedAggregates>;

type SubscribedDomainEvents =
  | ChildPredicateNodeAdded
  | ResponseGeneratorSet
  ;

type SubscribedEvents = | DataEvents<SubscribedAggregates, Metadata> | SubscribedDomainEvents;

const aggregateTypes = createExactArray(
  checkExactArray<SubscribedAggregates['@type']>()(
    'predicate-node',
    'predicate-template',
    'response-generator-template',
  )
);

const eventTypes = createExactArray(
  checkExactArray<SubscribedEvents['eventType']>()(
    'Create',
    'Update',
    'Delete',
    'ChildPredicateNodeAdded',
    'ResponseGeneratorSet',
  )
);

getAllPredicateNodes.initialize = async () => {
  response = [];
  const predicateTemplatesById: { [templateId: string]: PredicateTemplateAggregate } = {};
  const responseGeneratorTemplatesById: { [templateId: string]: ResponseGeneratorTemplateAggregate } = {};

  const dataEventHandler = createDataEventHandler<SubscribedAggregates, Metadata>({
    'predicate-template': {
      Create: evt => predicateTemplatesById[evt.aggregateId] = evt.aggregate,
      Update: evt => predicateTemplatesById[evt.aggregateId] = applyDiff(predicateTemplatesById[evt.aggregateId], evt.diff),
      Delete: evt => { delete predicateTemplatesById[evt.aggregateId]; },
    },

    'response-generator-template': {
      Create: evt => responseGeneratorTemplatesById[evt.aggregateId] = evt.aggregate,
      Update: evt => responseGeneratorTemplatesById[evt.aggregateId] = applyDiff(responseGeneratorTemplatesById[evt.aggregateId], evt.diff),
      Delete: evt => { delete responseGeneratorTemplatesById[evt.aggregateId]; },
    },

    'predicate-node': {
      Create: evt => {
        if (typeof evt.aggregate.templateInfoOrEvalFunctionBody === 'string') {
          response.push({
            id: evt.aggregateId,
            version: 1,
            name: evt.aggregate.name,
            description: evt.aggregate.description,
            templateInfoOrEvalFunctionBody: evt.aggregate.templateInfoOrEvalFunctionBody,
            childNodeIdsOrResponseGenerator: [],
          });

          return;
        }

        const template = predicateTemplatesById[evt.aggregate.templateInfoOrEvalFunctionBody.templateId];

        response.push({
          id: evt.aggregateId,
          version: 1,
          name: evt.aggregate.name,
          description: evt.aggregate.description,
          templateInfoOrEvalFunctionBody: {
            ...evt.aggregate.templateInfoOrEvalFunctionBody,
            templateDataSnapshot: {
              name: template.name,
              description: template.description,
              evalFunctionBody: template.evalFunctionBody,
              parameters: template.parameters,
            },
          },
          childNodeIdsOrResponseGenerator: [],
        });
      },

      Update: evt => {
        // only handle updates on simple properties; more complex updates are handled in the specific event handlers
        const dto = response.find(dto => dto.id === evt.aggregateId)!;
        dto.version = evt.metadata.version;
        dto.name = evt.diff.name || dto.name;
        dto.description = evt.diff.description || dto.description;

        if (typeof evt.diff.templateInfoOrEvalFunctionBody === 'string') {
          dto.templateInfoOrEvalFunctionBody = evt.diff.templateInfoOrEvalFunctionBody;
        }
      },

      Delete: evt => {
        response.splice(response.findIndex(dto => dto.id === evt.aggregateId), 1);
      },
    },
  });

  const domainEventHandler = createEventHandler<SubscribedDomainEvents>({
    ChildPredicateNodeAdded: evt => {
      const dto = response.find(dto => dto.id === evt.aggregateId)!;
      (dto.childNodeIdsOrResponseGenerator as string[]).push(evt.childNodeId);
    },

    ResponseGeneratorSet: evt => {
      const dto = response.find(dto => dto.id === evt.aggregateId)!;

      if (typeof evt.responseGenerator.templateInfoOrGeneratorFunctionBody === 'string') {
        const functionBody = evt.responseGenerator.templateInfoOrGeneratorFunctionBody;

        dto.childNodeIdsOrResponseGenerator = {
          name: evt.responseGenerator.name,
          description: evt.responseGenerator.description,
          templateInfoOrGeneratorFunctionBody: functionBody,
        };
      } else {
        const templateInfo = evt.responseGenerator.templateInfoOrGeneratorFunctionBody;

        dto.childNodeIdsOrResponseGenerator = {
          name: evt.responseGenerator.name,
          description: evt.responseGenerator.description,
          templateInfoOrGeneratorFunctionBody: {
            ...templateInfo,
            templateDataSnapshot: omit(responseGeneratorTemplatesById[evt.responseGenerator.templateInfoOrGeneratorFunctionBody.templateId], '@type', 'id'),
          },
        };
      }
    },
  });

  return getDomainAndDataEventStreamWithReplay<SubscribedAggregates, SubscribedEvents>(aggregateTypes, eventTypes)
    .subscribe(evt => dataEventHandler(evt) || domainEventHandler(evt));
};
