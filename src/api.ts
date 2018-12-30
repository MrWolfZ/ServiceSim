import express from 'express';
import path from 'path';
import { Subscription } from 'rxjs';
import * as ejp from './api-infrastructure/event-journal/persistence';
import * as elp from './api-infrastructure/event-log/persistence';
import * as predicateTemplatesApi from './modules/predicate-template/predicate-template.api';
import { PredicateTemplate } from './modules/predicate-template/predicate-template.entity';
import { PredicateNode } from './modules/predicate-tree/predicate-node.entity';
import * as predicateTreeApi from './modules/predicate-tree/predicate-tree.api';
import { ResponseGeneratorTemplate } from './modules/response-generator-template/response-generator-template';
import { PredicateTree } from './modules/simulation/predicate-tree.api';
import simulationApi from './modules/simulation/simulation.api';

// TODO: set adapter based on configuration
ejp.setAdapter(new ejp.InMemoryEventJournalPersistenceAdapter());
elp.setAdapter(new elp.InMemoryEventLogPersistenceAdapter());

export function startUiApiSubscriptions() {
  const subscriptions = [
    predicateTemplatesApi.start(),
    predicateTreeApi.start(),
  ];

  return new Subscription(() => subscriptions.forEach(sub => sub.unsubscribe()));
}

export const uiApi = express.Router();
uiApi.use('/predicate-templates', predicateTemplatesApi.api);

// TODO: fix issue that mock data is created multiple times when this function is called multiple times
export async function initializeAsync() {
  const sub1 = PredicateTree.start();
  const sub2 = startUiApiSubscriptions();

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

  const pathPrefixPredicateTemplate = PredicateTemplate.create({
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
  });

  await PredicateTemplate.saveAsync(pathPrefixPredicateTemplate);

  const methodPredicateTemplate = PredicateTemplate.create({
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

  await PredicateTemplate.saveAsync(methodPredicateTemplate);

  const getPredicateTemplate = PredicateTemplate.create({
    name: 'GET',
    description: 'Predicates based on this template match all GET requests.',
    evalFunctionBody: 'return request.method.toUpperCase() === "GET"',
    parameters: [],
  });

  await PredicateTemplate.saveAsync(getPredicateTemplate);

  const allPredicateTemplate = PredicateTemplate.create({
    name: 'All',
    // tslint:disable-next-line:max-line-length
    description: 'Predicates based on this template match all requests unconditionally. They are usually used for fallback scenarios in case not other predicates match.',
    evalFunctionBody: 'return true;',
    parameters: [],
  });

  await PredicateTemplate.saveAsync(allPredicateTemplate);

  const topLevelPredicateNode1 = PredicateNode.create({
    name: pathPrefixPredicateTemplate.name,
    description: '',
    templateInfoOrEvalFunctionBody: {
      templateId: pathPrefixPredicateTemplate.id,
      templateVersion: pathPrefixPredicateTemplate.unmutatedVersion,
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
      templateVersion: pathPrefixPredicateTemplate.unmutatedVersion,
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
      templateVersion: pathPrefixPredicateTemplate.unmutatedVersion,
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
      templateVersion: allPredicateTemplate.unmutatedVersion,
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

  return () => {
    sub1.unsubscribe();
    sub2.unsubscribe();
  };
}

export const api = express.Router();
api.use('/simulation', simulationApi);
api.use('/ui-api', uiApi);
api.use('/ui', express.static(path.join(__dirname, 'ui', 'dist')));
api.use((_, res) => res.sendFile(path.join(__dirname, 'ui', 'dist', 'index.html')));

api.use(function (err: any, _: express.Request, res: express.Response, next: express.NextFunction) {
  if (res.headersSent) {
    return next(err);
  }

  return res.status(err.status || 500).render('500');
});
