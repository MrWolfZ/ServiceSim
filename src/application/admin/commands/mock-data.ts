import { ALL, PATH_PREFIX } from 'src/application/predicate-template/default-templates';
import { getAllPredicateTemplates } from 'src/application/predicate-template/queries/get-all-predicate-templates';
import { addChildPredicateNodeFromTemplate } from 'src/application/predicate-tree/commands/add-child-predicate-node-from-template';
import { setPredicateNodeResponseGeneratorFromTemplate } from 'src/application/predicate-tree/commands/set-predicate-node-response-generator-from-template';
import { getAllPredicateNodes } from 'src/application/predicate-tree/queries/get-all-predicate-nodes';
import { STATIC } from 'src/application/response-generator-template/default-templates';
import { getAllResponseGeneratorTemplates } from 'src/application/response-generator-template/queries/get-all-response-generator-templates';

export async function setupMockData() {
  const allTemplates = await getAllPredicateTemplates();
  const pathPrefixPredicateTemplate = allTemplates.find(t => t.name === PATH_PREFIX.name)!;
  const allPredicateTemplate = allTemplates.find(t => t.name === ALL.name)!;

  const allResponseGeneratorTemplates = await getAllResponseGeneratorTemplates();
  const staticResponseGeneratorTemplate = allResponseGeneratorTemplates.find(t => t.name === STATIC.name)!;

  const rootNode = (await getAllPredicateNodes())[0];

  const topLevelPredicateNode1Result = await addChildPredicateNodeFromTemplate({
    parentNodeId: rootNode.id,
    name: pathPrefixPredicateTemplate.name,
    description: '',
    templateInfo: {
      templateId: pathPrefixPredicateTemplate.id,
      templateVersion: pathPrefixPredicateTemplate.version,
      parameterValues: {
        Prefix: '/api',
      },
    },
  });

  const childPredicateNode1Result = await addChildPredicateNodeFromTemplate({
    parentNodeId: topLevelPredicateNode1Result.nodeId,
    name: pathPrefixPredicateTemplate.name,
    description: '',
    templateInfo: {
      templateId: pathPrefixPredicateTemplate.id,
      templateVersion: pathPrefixPredicateTemplate.version,
      parameterValues: {
        Prefix: '/api/books',
      },
    },
  });

  await setPredicateNodeResponseGeneratorFromTemplate({
    nodeId: childPredicateNode1Result.nodeId,
    unmodifiedNodeVersion: childPredicateNode1Result.nodeVersion,
    name: 'Static',
    description: '',
    templateInfo: {
      templateId: staticResponseGeneratorTemplate.id,
      templateVersion: staticResponseGeneratorTemplate.version,
      parameterValues: {
        'Status Code': 200,
        'Body': JSON.stringify([{ title: 'LOTR' }]),
        'Content Type': 'application/json',
      },
    },
  });

  const childPredicateNode2Result = await addChildPredicateNodeFromTemplate({
    parentNodeId: topLevelPredicateNode1Result.nodeId,
    name: pathPrefixPredicateTemplate.name,
    description: '',
    templateInfo: {
      templateId: pathPrefixPredicateTemplate.id,
      templateVersion: pathPrefixPredicateTemplate.version,
      parameterValues: {
        Prefix: '/api/authors',
      },
    },
  });

  await setPredicateNodeResponseGeneratorFromTemplate({
    nodeId: childPredicateNode2Result.nodeId,
    unmodifiedNodeVersion: childPredicateNode2Result.nodeVersion,
    name: 'Static',
    description: '',
    templateInfo: {
      templateId: staticResponseGeneratorTemplate.id,
      templateVersion: staticResponseGeneratorTemplate.version,
      parameterValues: {
        'Status Code': 200,
        'Body': JSON.stringify([{ title: 'Tolkien' }]),
        'Content Type': 'application/json',
      },
    },
  });

  const topLevelPredicateNode2Result = await addChildPredicateNodeFromTemplate({
    parentNodeId: rootNode.id,
    name: allPredicateTemplate.name,
    description: '',
    templateInfo: {
      templateId: allPredicateTemplate.id,
      templateVersion: allPredicateTemplate.version,
      parameterValues: {},
    },
  });

  await setPredicateNodeResponseGeneratorFromTemplate({
    nodeId: topLevelPredicateNode2Result.nodeId,
    unmodifiedNodeVersion: topLevelPredicateNode2Result.nodeVersion,
    name: 'Status Code',
    description: '',
    templateInfo: {
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
