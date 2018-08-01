import express from 'express';
import path from 'path';

import { Predicate, PredicateKind, ResponseGeneratorKind } from './domain';
import * as ejp from './infrastructure/event-journal/persistence';
import * as elp from './infrastructure/event-log/persistence';
import { PredicateTree } from './simulation';
import simulationApi from './simulation/api';
import uiApi from './ui/app/app.api';
import { PredicateKindsApi } from './ui/app/configuration/predicate-kinds-page/predicate-kinds.api';

// TODO: set adapter based on configuration
ejp.setAdapter(new ejp.InMemoryEventJournalPersistenceAdapter());
elp.setAdapter(new elp.InMemoryEventLogPersistenceAdapter());

export async function initializeAsync() {
  const sub1 = PredicateTree.start();
  const sub2 = PredicateKindsApi.start();

  const staticResponseGeneratorKind = ResponseGeneratorKind.create(
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

  await ResponseGeneratorKind.saveAsync(staticResponseGeneratorKind);

  const pathPrefixPredicateKind = PredicateKind.create(
    'Path Prefix',
    'Predicates of this kind match all requests whose path starts with a provided string.',
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

  await PredicateKind.saveAsync(pathPrefixPredicateKind);

  const methodPredicateKind = PredicateKind.create(
    'Method',
    'Predicates of this kind match all requests that have one of a specified list of methods.',
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

  await PredicateKind.saveAsync(methodPredicateKind);

  const getPredicateKind = PredicateKind.create(
    'GET',
    'Predicates of this kind match all GET requests',
    'return request.method.toUpperCase() === "GET"',
    [],
  );

  await PredicateKind.saveAsync(getPredicateKind);

  const allPredicateKind = PredicateKind.create(
    'All',
    'Predicates of this kind match all requests unconditionally. They are usually used for fallback scenarios in case not other predicates match.',
    'return true;',
    [],
  );

  await PredicateKind.saveAsync(allPredicateKind);

  const topLevelPredicate1 = Predicate.create(pathPrefixPredicateKind.id, {
    Prefix: '/api',
  }, undefined);

  await Predicate.saveAsync(topLevelPredicate1);

  const childPredicate1 = Predicate.create(pathPrefixPredicateKind.id, {
    Prefix: '/api/books',
  }, undefined);

  childPredicate1.setResponseGenerator(staticResponseGeneratorKind.id, {
    'Status Code': 200,
    'Body': JSON.stringify([{ title: 'LOTR' }]),
    'Content Type': 'application/json',
  });

  await Predicate.saveAsync(childPredicate1);

  topLevelPredicate1.addChildPredicate(childPredicate1.id);

  const childPredicate2 = Predicate.create(pathPrefixPredicateKind.id, {
    Prefix: '/api/authors',
  }, undefined);

  childPredicate2.setResponseGenerator(staticResponseGeneratorKind.id, {
    'Status Code': 200,
    'Body': JSON.stringify([{ name: 'Tolkien' }]),
    'Content Type': 'application/json',
  });

  await Predicate.saveAsync(childPredicate2);

  topLevelPredicate1.addChildPredicate(childPredicate2.id);

  await Predicate.saveAsync(topLevelPredicate1);

  const topLevelPredicate2 = Predicate.create(allPredicateKind.id, {}, undefined);
  topLevelPredicate2.setResponseGenerator(staticResponseGeneratorKind.id, { 'Status Code': 204 });

  await Predicate.saveAsync(topLevelPredicate2);

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
