import { unwrap } from '../../util/result-monad';
import { ALL, PATH_PREFIX } from '../predicate-template/default-templates';
import * as predicateTemplateApi from '../predicate-template/predicate-template.api';
import * as predicateNodeApi from '../predicate-tree/predicate-node.api';
import { STATIC } from '../response-generator-template/default-templates';
import * as responseGeneratorTemplateApi from '../response-generator-template/response-generator-template.api';

export async function setupMockData() {
  const allTemplates = await predicateTemplateApi.getAllAsync();
  const pathPrefixPredicateTemplate = allTemplates.find(t => t.name === PATH_PREFIX.name)!;
  const allPredicateTemplate = allTemplates.find(t => t.name === ALL.name)!;

  const allResponseGeneratorTemplates = await responseGeneratorTemplateApi.getAllAsync();
  const staticResponseGeneratorTemplate = allResponseGeneratorTemplates.find(t => t.name === STATIC.name)!;

  const rootNode = (await predicateTemplateApi.getAllAsync())[0];

  const topLevelPredicateNode1Result = unwrap(
    await predicateNodeApi.createAsync({
      parentNodeId: rootNode.id,
      name: pathPrefixPredicateTemplate.name,
      description: '',
      templateInfoOrEvalFunctionBody: {
        templateId: pathPrefixPredicateTemplate.id,
        templateVersion: pathPrefixPredicateTemplate.version,
        parameterValues: {
          Prefix: '/api',
        },
      },
    })
  );

  const childPredicateNode1Result = unwrap(
    await predicateNodeApi.createAsync({
      parentNodeId: topLevelPredicateNode1Result.nodeId,
      name: pathPrefixPredicateTemplate.name,
      description: '',
      templateInfoOrEvalFunctionBody: {
        templateId: pathPrefixPredicateTemplate.id,
        templateVersion: pathPrefixPredicateTemplate.version,
        parameterValues: {
          Prefix: '/api/books',
        },
      },
    })
  );

  await predicateNodeApi.setResponseGeneratorAsync({
    nodeId: childPredicateNode1Result.nodeId,
    unmodifiedNodeVersion: childPredicateNode1Result.nodeVersion,
    name: 'Static',
    description: '',
    templateInfoOrGeneratorFunctionBody: {
      templateId: staticResponseGeneratorTemplate.id,
      templateVersion: staticResponseGeneratorTemplate.version,
      parameterValues: {
        'Status Code': 200,
        'Body': JSON.stringify([{ title: 'LOTR' }]),
        'Content Type': 'application/json',
      },
    },
  });

  const childPredicateNode2Result = unwrap(
    await predicateNodeApi.createAsync({
      parentNodeId: topLevelPredicateNode1Result.nodeId,
      name: pathPrefixPredicateTemplate.name,
      description: '',
      templateInfoOrEvalFunctionBody: {
        templateId: pathPrefixPredicateTemplate.id,
        templateVersion: pathPrefixPredicateTemplate.version,
        parameterValues: {
          Prefix: '/api/authors',
        },
      },
    })
  );

  await predicateNodeApi.setResponseGeneratorAsync({
    nodeId: childPredicateNode2Result.nodeId,
    unmodifiedNodeVersion: childPredicateNode2Result.nodeVersion,
    name: 'Static',
    description: '',
    templateInfoOrGeneratorFunctionBody: {
      templateId: staticResponseGeneratorTemplate.id,
      templateVersion: staticResponseGeneratorTemplate.version,
      parameterValues: {
        'Status Code': 200,
        'Body': JSON.stringify([{ title: 'Tolkien' }]),
        'Content Type': 'application/json',
      },
    },
  });

  const topLevelPredicateNode2Result = unwrap(
    await predicateNodeApi.createAsync({
      parentNodeId: rootNode.id,
      name: allPredicateTemplate.name,
      description: '',
      templateInfoOrEvalFunctionBody: {
        templateId: allPredicateTemplate.id,
        templateVersion: allPredicateTemplate.version,
        parameterValues: {},
      },
    })
  );

  await predicateNodeApi.setResponseGeneratorAsync({
    nodeId: topLevelPredicateNode2Result.nodeId,
    unmodifiedNodeVersion: topLevelPredicateNode2Result.nodeVersion,
    name: 'Status Code',
    description: '',
    templateInfoOrGeneratorFunctionBody: {
      templateId: staticResponseGeneratorTemplate.id,
      templateVersion: staticResponseGeneratorTemplate.version,
      parameterValues: {
        'Status Code': 204,
      },
    },
  });
}
