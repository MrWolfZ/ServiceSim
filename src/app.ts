import express from 'express';

import * as apiController from './controllers/api';
import * as ap from './controllers/projections/all-predicates';
import * as pk from './domain/predicate-kind/predicate-kind';
import * as p from './domain/predicate/predicate';
import * as rgk from './domain/response-generator-kind/response-generator-kind';
import * as rg from './domain/response-generator/response-generator';
import * as ejp from './infrastructure/event-journal/persistence';
import * as elp from './infrastructure/event-log/persistence';

// TODO: set adapter based on configuration
ejp.setAdapter(new ejp.InMemoryEventJournalPersistenceAdapter());
elp.setAdapter(new elp.InMemoryEventLogPersistenceAdapter());

export async function initializeAsync() {
  const sub1 = ap.start();

  let staticResponseGeneratorKind = rgk.create(
    'static',
    'returns a static response',
    'return { statusCode: properties.statusCode, body: properties.body };',
  );

  staticResponseGeneratorKind = rgk.addPropertyDescriptor(
    staticResponseGeneratorKind,
    'statusCode',
    'the status code of the response',
    true,
    'number',
  );

  staticResponseGeneratorKind = rgk.addPropertyDescriptor(
    staticResponseGeneratorKind,
    'body',
    'the body of the response',
    false,
    'string',
  );

  staticResponseGeneratorKind = await rgk.saveAsync(staticResponseGeneratorKind);

  const noContentResponseGenerator = rg.create(staticResponseGeneratorKind.id, {
    statusCode: 204,
  });

  await rg.saveAsync(noContentResponseGenerator);

  let allPredicateKind = pk.create(
    'all',
    'accepts all requests',
    'return true;',
  );

  allPredicateKind = await pk.saveAsync(allPredicateKind);

  let rootPredicate = p.create(allPredicateKind.id);
  rootPredicate = p.setResponseGenerator(rootPredicate, noContentResponseGenerator.id);

  await p.saveAsync(rootPredicate);

  return () => {
    sub1.unsubscribe();
  };
}

initializeAsync();

const app = express.Router();

app.use(apiController.processRequest);

export default app;
