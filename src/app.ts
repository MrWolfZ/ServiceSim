import express from 'express';

import { Predicate, PredicateKind, ResponseGeneratorKind } from './domain';
import * as ejp from './infrastructure/event-journal/persistence';
import * as elp from './infrastructure/event-log/persistence';
import simulationApi from './simulation/api';
import * as ap from './simulation/predicate-tree';

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

  const allPredicateKind = PredicateKind.create(
    'all',
    'accepts all requests',
    'return true;',
  );

  await PredicateKind.saveAsync(allPredicateKind);

  const rootPredicate = Predicate.create(allPredicateKind.id, {}, undefined);
  rootPredicate.setResponseGenerator(staticResponseGeneratorKind.id, { statusCode: 204 });

  await Predicate.saveAsync(rootPredicate);

  return () => {
    sub1.unsubscribe();
  };
}

const app = express.Router();
app.use('/simulation', simulationApi);

export default app;
