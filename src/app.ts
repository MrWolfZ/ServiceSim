import express from 'express';

import * as apiController from './controllers/api';
import { start } from './controllers/projections/all-matchers';
import * as rm from './domain/request-matcher/request-matcher';
import * as ejp from './infrastructure/event-journal/persistence';
import * as elp from './infrastructure/event-log/persistence';

// TODO: set adapter based on configuration
ejp.setAdapter(new ejp.InMemoryEventJournalPersistenceAdapter());
elp.setAdapter(new elp.InMemoryEventLogPersistenceAdapter());

async function initializeAsync() {
  const sub1 = start();

  const matcher = rm.create(
    'matchers/1',
    'path-pattern',
    {
      pattern: '',
    },
  );

  await rm.saveAsync(matcher);

  return () => {
    sub1.unsubscribe();
  };
}

initializeAsync();

const app = express.Router();

app.use(apiController.processRequest);

export default app;
