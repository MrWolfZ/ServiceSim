import express from 'express';
import path from 'path';

import { PredicateNode, PredicateTemplate, ResponseGeneratorTemplate } from './domain';
import * as ejp from './infrastructure/event-journal/persistence';
import * as elp from './infrastructure/event-log/persistence';
import { PredicateTree } from './simulation';
import simulationApi from './simulation/api';
import uiApi from './ui/app/app.api';
import { PredicateTemplatesApi } from './ui/app/configuration/predicate-templates-page/predicate-templates.api';

// TODO: set adapter based on configuration
ejp.setAdapter(new ejp.InMemoryEventJournalPersistenceAdapter());
elp.setAdapter(new elp.InMemoryEventLogPersistenceAdapter());

export async function initializeAsync() {
  const sub1 = PredicateTree.start();
  const sub2 = PredicateTemplatesApi.start();

  const staticResponseGeneratorTemplate = ResponseGeneratorTemplate.create(
    'static',
    'returns a static response',
    'return { statusCode: parameters["Status Code"], body: parameters["Body"], contentType: parameters["Content Type"] };',
    [
      {
        name: 'Status Code',
        description: 'The HTTP status code of the response',
        isRequired: true,
        valueType: 'number',
        defaultValue: '204',
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

  const pathPrefixPredicateTemplate = PredicateTemplate.create(
    'Path Prefix',
    'Predicates based on this template match all requests whose path starts with a provided string.',
    'return request.path.startsWith(parameters["Prefix"]);',
    [
      {
        name: 'Prefix',
        description: 'The prefix to check the path for.',
        isRequired: true,
        valueType: 'string',
        defaultValue: '/',
      },
    ],
  );

  await PredicateTemplate.saveAsync(pathPrefixPredicateTemplate);

  const methodPredicateTemplate = PredicateTemplate.create(
    'Method',
    'Predicates based on this template match all requests that have one of a specified list of methods.',
    'return parameters["Allowed Methods"].split(",").map(m => m.trim().toUpperCase()).includes(request.method.toUpperCase());',
    [
      {
        name: 'Allowed Methods',
        description: 'A comma separated list of methods to match.',
        isRequired: true,
        valueType: 'string',
        defaultValue: 'GET,POST,PUT,DELETE',
      },
    ],
  );

  await PredicateTemplate.saveAsync(methodPredicateTemplate);

  const getPredicateTemplate = PredicateTemplate.create(
    'GET',
    'Predicates based on this template match all GET requests',
    'return request.method.toUpperCase() === "GET"',
    [],
  );

  await PredicateTemplate.saveAsync(getPredicateTemplate);

  const allPredicateTemplate = PredicateTemplate.create(
    'All',
    'Predicates based on this template match all requests unconditionally. They are usually used for fallback scenarios in case not other predicates match.',
    'return true;',
    [],
  );

  await PredicateTemplate.saveAsync(allPredicateTemplate);

  const topLevelPredicateNode1 = PredicateNode.create(pathPrefixPredicateTemplate, {
    Prefix: '/api',
  }, undefined);

  await PredicateNode.saveAsync(topLevelPredicateNode1);

  const childPredicateNode1 = PredicateNode.create(pathPrefixPredicateTemplate, {
    Prefix: '/api/books',
  }, undefined);

  childPredicateNode1.setResponseGenerator(staticResponseGeneratorTemplate, {
    'Status Code': 200,
    'Body': JSON.stringify([{ title: 'LOTR' }]),
    'Content Type': 'application/json',
  });

  await PredicateNode.saveAsync(childPredicateNode1);

  topLevelPredicateNode1.addChildPredicate(childPredicateNode1.id);

  const childPredicateNode2 = PredicateNode.create(pathPrefixPredicateTemplate, {
    Prefix: '/api/authors',
  }, undefined);

  childPredicateNode2.setResponseGenerator(staticResponseGeneratorTemplate, {
    'Status Code': 200,
    'Body': JSON.stringify([{ name: 'Tolkien' }]),
    'Content Type': 'application/json',
  });

  await PredicateNode.saveAsync(childPredicateNode2);

  topLevelPredicateNode1.addChildPredicate(childPredicateNode2.id);

  await PredicateNode.saveAsync(topLevelPredicateNode1);

  const topLevelPredicateNode2 = PredicateNode.create(allPredicateTemplate, {}, undefined);
  topLevelPredicateNode2.setResponseGenerator(staticResponseGeneratorTemplate, { 'Status Code': 204 });

  await PredicateNode.saveAsync(topLevelPredicateNode2);

  return () => {
    sub1.unsubscribe();
    sub2.unsubscribe();
  };
}

const app = express.Router();
app.use('/simulation', simulationApi);
app.use('/uiApi', uiApi);
app.use('/ui', express.static(path.join(__dirname, 'ui', 'dist')));
app.use((_, res) => res.sendFile(path.join(__dirname, 'ui', 'dist', 'index.html')));

app.use(function (err: any, _: express.Request, res: express.Response, next: express.NextFunction) {
  if (res.headersSent) {
    return next(err);
  }

  return res.status(err.status || 500).render('500');
});

export default app;
