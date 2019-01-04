import { unwrap } from '../../util/result-monad';
import * as predicateTemplateApi from '../predicate-template/predicate-template.api';
import { PredicateNode } from '../predicate-tree/predicate-node.entity';
import { ResponseGeneratorTemplate } from '../response-generator-template/response-generator-template';

export async function setupMockData() {
  await predicateTemplateApi.deleteAllAsync();

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

  const pathPrefixPredicateTemplateId = unwrap(await predicateTemplateApi.createAsync({
    name: 'Path Prefix',
    description: 'Predicates based on this template match all requests whose path starts with a provided string.',
    evalFunctionBody: 'return request.path.startsWith(parameters["Prefix"]);',
    parameters: [
      {
        name: 'Prefix',
        description: 'The prefix to check the path for.',
        isRequired: true,
        valueType: 'string',
        defaultValue: '/',
      },
    ],
  })).templateId;

  await predicateTemplateApi.createAsync({
    name: 'Method',
    description: 'Predicates based on this template match all requests that have one of a specified list of methods.',
    evalFunctionBody: 'return parameters["Allowed Methods"].split(",").map(m => m.trim().toUpperCase()).includes(request.method.toUpperCase());',
    parameters: [
      {
        name: 'Allowed Methods',
        description: 'A comma separated list of methods to match.',
        isRequired: true,
        valueType: 'string',
        defaultValue: 'GET,POST,PUT,DELETE',
      },
    ],
  });

  await predicateTemplateApi.createAsync({
    name: 'GET',
    description: 'Predicates based on this template match all GET requests.',
    evalFunctionBody: 'return request.method.toUpperCase() === "GET"',
    parameters: [],
  });

  const allPredicateTemplateId = unwrap(await predicateTemplateApi.createAsync({
    name: 'All',
    // tslint:disable-next-line:max-line-length
    description: 'Predicates based on this template match all requests unconditionally. They are usually used for fallback scenarios in case not other predicates match.',
    evalFunctionBody: 'return true;',
    parameters: [],
  })).templateId;

  const allTemplates = await predicateTemplateApi.getAllAsync();
  const pathPrefixPredicateTemplate = allTemplates.find(t => t.id === pathPrefixPredicateTemplateId)!;
  const allPredicateTemplate = allTemplates.find(t => t.id === allPredicateTemplateId)!;

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
