import express from 'express';

import * as apiController from './controllers/api';
import * as ap from './controllers/projections/all-predicates';
import { Predicate, PredicateKind, ResponseGenerator, ResponseGeneratorKind } from './domain';
import * as ejp from './infrastructure/event-journal/persistence';
import * as elp from './infrastructure/event-log/persistence';

// TODO: set adapter based on configuration
ejp.setAdapter(new ejp.InMemoryEventJournalPersistenceAdapter());
elp.setAdapter(new elp.InMemoryEventLogPersistenceAdapter());

export async function initializeAsync() {
  const sub1 = ap.start();

  const staticResponseGeneratorKind = ResponseGeneratorKind.create(
    'static',
    'returns a static response',
    'return { statusCode: properties.statusCode, body: properties.body };',
  );

  staticResponseGeneratorKind.addPropertyDescriptor(
    'statusCode',
    'the status code of the response',
    true,
    'number',
  );

  staticResponseGeneratorKind.addPropertyDescriptor(
    'body',
    'the body of the response',
    false,
    'string',
  );

  await ResponseGeneratorKind.saveAsync(staticResponseGeneratorKind);

  const noContentResponseGenerator = ResponseGenerator.create(staticResponseGeneratorKind.id, {
    statusCode: 204,
  });

  await ResponseGenerator.saveAsync(noContentResponseGenerator);

  const allPredicateKind = PredicateKind.create(
    'all',
    'accepts all requests',
    'return true;',
  );

  await PredicateKind.saveAsync(allPredicateKind);

  const rootPredicate = Predicate.create(allPredicateKind.id);
  rootPredicate.setResponseGenerator(noContentResponseGenerator.id);

  await Predicate.saveAsync(rootPredicate);

  return () => {
    sub1.unsubscribe();
  };
}

initializeAsync();

const app = express.Router();

app.use(apiController.processRequest);

export default app;
