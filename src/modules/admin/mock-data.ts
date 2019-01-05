import { ALL, PATH_PREFIX } from '../predicate-template/default-templates';
import * as predicateTemplateApi from '../predicate-template/predicate-template.api';
import { PredicateNode } from '../predicate-tree/predicate-node.entity';
import { ResponseGeneratorTemplate } from '../response-generator-template/response-generator-template';

export async function setupMockData() {
  const staticResponseGeneratorTemplate = ResponseGeneratorTemplate.create(
    'static',
    'Response generators based on this template return a static configured response.',
    'return { statusCode: parameters["Status Code"], body: parameters["Body"], contentType: parameters["Content Type"] };',
    [
      {
        name: 'Status Code',
        description: 'The HTTP status code of the response',
        isRequired: true,
        valueType: 'number',
        defaultValue: 204,
      },
      {
        name: 'Body',
        description: 'The body of the response',
        isRequired: false,
        valueType: 'string',
        defaultValue: '',
      },
      {
        name: 'Content Type',
        description: 'The content type of the response',
        isRequired: false,
        valueType: 'string',
        defaultValue: 'application/json',
      },
    ],
  );

  await ResponseGeneratorTemplate.saveAsync(staticResponseGeneratorTemplate);

  const allTemplates = await predicateTemplateApi.getAllAsync();
  const pathPrefixPredicateTemplate = allTemplates.find(t => t.name === PATH_PREFIX.name)!;
  const allPredicateTemplate = allTemplates.find(t => t.name === ALL.name)!;

  const topLevelPredicateNode1 = PredicateNode.create({
    name: pathPrefixPredicateTemplate.name,
    description: '',
    templateInfoOrEvalFunctionBody: {
      templateId: pathPrefixPredicateTemplate.id,
      templateVersion: 1,
      templateDataSnapshot: {
        name: pathPrefixPredicateTemplate.name,
        description: pathPrefixPredicateTemplate.description,
        evalFunctionBody: pathPrefixPredicateTemplate.evalFunctionBody,
        parameters: pathPrefixPredicateTemplate.parameters,
      },
      parameterValues: {
        Prefix: '/api',
      },
    },
    childNodeIdsOrResponseGenerator: undefined,
  });

  await PredicateNode.saveAsync(topLevelPredicateNode1);

  const childPredicateNode1 = PredicateNode.create({
    name: pathPrefixPredicateTemplate.name,
    description: '',
    templateInfoOrEvalFunctionBody: {
      templateId: pathPrefixPredicateTemplate.id,
      templateVersion: 1,
      templateDataSnapshot: {
        name: pathPrefixPredicateTemplate.name,
        description: pathPrefixPredicateTemplate.description,
        evalFunctionBody: pathPrefixPredicateTemplate.evalFunctionBody,
        parameters: pathPrefixPredicateTemplate.parameters,
      },
      parameterValues: {
        Prefix: '/api/books',
      },
    },
    childNodeIdsOrResponseGenerator: undefined,
  });

  childPredicateNode1.setResponseGenerator({
    name: 'Static',
    description: '',
    templateInfoOrGeneratorFunctionBody: {
      templateId: staticResponseGeneratorTemplate.id,
      templateVersion: staticResponseGeneratorTemplate.unmutatedVersion,
      templateDataSnapshot: {
        name: staticResponseGeneratorTemplate.name,
        description: staticResponseGeneratorTemplate.description,
        generatorFunctionBody: staticResponseGeneratorTemplate.generatorFunctionBody,
        parameters: staticResponseGeneratorTemplate.parameters,
      },
      parameterValues: {
        'Status Code': 200,
        'Body': JSON.stringify([{ title: 'LOTR' }]),
        'Content Type': 'application/json',
      },
    },
  });

  await PredicateNode.saveAsync(childPredicateNode1);

  topLevelPredicateNode1.addChildPredicate(childPredicateNode1.id);

  const childPredicateNode2 = PredicateNode.create({
    name: pathPrefixPredicateTemplate.name,
    description: '',
    templateInfoOrEvalFunctionBody: {
      templateId: pathPrefixPredicateTemplate.id,
      templateVersion: 1,
      templateDataSnapshot: {
        name: pathPrefixPredicateTemplate.name,
        description: pathPrefixPredicateTemplate.description,
        evalFunctionBody: pathPrefixPredicateTemplate.evalFunctionBody,
        parameters: pathPrefixPredicateTemplate.parameters,
      },
      parameterValues: {
        Prefix: '/api/authors',
      },
    },
    childNodeIdsOrResponseGenerator: undefined,
  });

  childPredicateNode2.setResponseGenerator({
    name: 'Static',
    description: '',
    templateInfoOrGeneratorFunctionBody: {
      templateId: staticResponseGeneratorTemplate.id,
      templateVersion: staticResponseGeneratorTemplate.unmutatedVersion,
      templateDataSnapshot: {
        name: staticResponseGeneratorTemplate.name,
        description: staticResponseGeneratorTemplate.description,
        generatorFunctionBody: staticResponseGeneratorTemplate.generatorFunctionBody,
        parameters: staticResponseGeneratorTemplate.parameters,
      },
      parameterValues: {
        'Status Code': 200,
        'Body': JSON.stringify([{ name: 'Tolkien' }]),
        'Content Type': 'application/json',
      },
    },
  });

  await PredicateNode.saveAsync(childPredicateNode2);

  topLevelPredicateNode1.addChildPredicate(childPredicateNode2.id);

  await PredicateNode.saveAsync(topLevelPredicateNode1);

  const topLevelPredicateNode2 = PredicateNode.create({
    name: allPredicateTemplate.name,
    description: '',
    templateInfoOrEvalFunctionBody: {
      templateId: allPredicateTemplate.id,
      templateVersion: 1,
      templateDataSnapshot: {
        name: allPredicateTemplate.name,
        description: allPredicateTemplate.description,
        evalFunctionBody: allPredicateTemplate.evalFunctionBody,
        parameters: allPredicateTemplate.parameters,
      },
      parameterValues: {},
    },
    childNodeIdsOrResponseGenerator: undefined,
  });

  topLevelPredicateNode2.setResponseGenerator({
    name: 'Status Code',
    description: '',
    templateInfoOrGeneratorFunctionBody: {
      templateId: staticResponseGeneratorTemplate.id,
      templateVersion: staticResponseGeneratorTemplate.unmutatedVersion,
      templateDataSnapshot: {
        name: staticResponseGeneratorTemplate.name,
        description: staticResponseGeneratorTemplate.description,
        generatorFunctionBody: staticResponseGeneratorTemplate.generatorFunctionBody,
        parameters: staticResponseGeneratorTemplate.parameters,
      },
      parameterValues: {
        'Status Code': 204,
      },
    },
  });

  await PredicateNode.saveAsync(topLevelPredicateNode2);
}
