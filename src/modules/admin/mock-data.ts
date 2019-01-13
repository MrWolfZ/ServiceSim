import { ALL, PATH_PREFIX } from '../predicate-template/default-templates';
import { getAllPredicateTemplates } from '../predicate-template/queries/get-all-predicate-templates';
import { addChildPredicateNode, getAllPredicateNodes, setPredicateNodeResponseGenerator } from '../predicate-tree/predicate-node.api';
import { STATIC } from '../response-generator-template/default-templates';
import { getAllResponseGeneratorTemplates } from '../response-generator-template/response-generator-template.api';

export async function setupMockData() {
  const allTemplates = await getAllPredicateTemplates();
  const pathPrefixPredicateTemplate = allTemplates.find(t => t.name === PATH_PREFIX.name)!;
  const allPredicateTemplate = allTemplates.find(t => t.name === ALL.name)!;

  const allResponseGeneratorTemplates = await getAllResponseGeneratorTemplates();
  const staticResponseGeneratorTemplate = allResponseGeneratorTemplates.find(t => t.name === STATIC.name)!;

  const rootNode = (await getAllPredicateNodes())[0];

  const topLevelPredicateNode1Result = await addChildPredicateNode({
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
  });

  const childPredicateNode1Result = await addChildPredicateNode({
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
  });

  await setPredicateNodeResponseGenerator({
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

  const childPredicateNode2Result = await addChildPredicateNode({
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
  });

  await setPredicateNodeResponseGenerator({
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

  const topLevelPredicateNode2Result = await addChildPredicateNode({
    parentNodeId: rootNode.id,
    name: allPredicateTemplate.name,
    description: '',
    templateInfoOrEvalFunctionBody: {
      templateId: allPredicateTemplate.id,
      templateVersion: allPredicateTemplate.version,
      parameterValues: {},
    },
  });

  await setPredicateNodeResponseGenerator({
    nodeId: topLevelPredicateNode2Result.nodeId,
    unmodifiedNodeVersion: topLevelPredicateNode2Result.nodeVersion,
    name: 'Status Code',
    description: '',
    templateInfoOrGeneratorFunctionBody: {
      templateId: staticResponseGeneratorTemplate.id,
      templateVersion: staticResponseGeneratorTemplate.version,
      parameterValues: {
        'Status Code': 204,
        'Body': '',
        'Content Type': '',
      },
    },
  });
}
