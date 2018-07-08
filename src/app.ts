import express from 'express';

import * as apiController from './controllers/api';
import { startAsync } from './controllers/projections/all-matchers';
import { saveAsync } from './domain/request-matcher/repository';
import * as rm from './domain/request-matcher/request-matcher';
import * as ejp from './infrastructure/event-journal/persistence';
import * as elp from './infrastructure/event-log/persistence';

// TODO: set adapter based on configuration
ejp.setAdapter(new ejp.InMemoryEventJournalPersistenceAdapter());
elp.setAdapter(new elp.InMemoryEventLogPersistenceAdapter());

async function initializeAsync() {
  await startAsync();

  const matcher = rm.create(
    'matchers/1',
    'path-pattern',
    {
      pattern: '',
    },
  );

  await saveAsync(matcher);
}

initializeAsync();

const app = express.Router();

app.use(apiController.processRequest);

export default app;
