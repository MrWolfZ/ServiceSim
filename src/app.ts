import express from 'express';

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
    'return { statusCode: properties.statusCode, body: properties.body };',
  );

  // // staticResponseGeneratorKind.addParameter(
  // //   'statusCode',
  // //   'the status code of the response',
  // //   true,
  // //   'number',
  // // );

  // // staticResponseGeneratorKind.addParameter(
  // //   'body',
  // //   'the body of the response',
  // //   false,
  // //   'string',
  // // );

  await ResponseGeneratorKind.saveAsync(staticResponseGeneratorKind);

  const allPredicateKind = PredicateKind.create(
    'All',
    'Predicates of this kind match all requests unconditionally. They are usually used for fallback scenarios in case not other predicates match.',
    'return true;',
    [],
  );

  await PredicateKind.saveAsync(allPredicateKind);

  const rootPredicate = Predicate.create(allPredicateKind.id, {}, undefined);
  rootPredicate.setResponseGenerator(staticResponseGeneratorKind.id, { statusCode: 204 });

  await Predicate.saveAsync(rootPredicate);

  return () => {
    sub1.unsubscribe();
    sub2.unsubscribe();
  };
}

const app = express.Router();
app.use('/simulation', simulationApi);
app.use('/uiApi', uiApi);

export default app;
