import express from 'express';
import path from 'path';
import { Subscription } from 'rxjs';
import { db } from './api-infrastructure';
import * as ejp from './api-infrastructure/event-journal/persistence';
import * as elp from './api-infrastructure/event-log/persistence';
import * as adminApi from './modules/admin/admin.api';
import * as predicateTemplatesApi from './modules/predicate-template/predicate-template.api';
import * as predicateTreeApi from './modules/predicate-tree/predicate-tree.api';
import { PredicateTree } from './modules/simulation/predicate-tree.api';
import simulationApi from './modules/simulation/simulation.api';

// TODO: set adapter based on configuration
ejp.setAdapter(new ejp.InMemoryEventJournalPersistenceAdapter());
elp.setAdapter(new elp.InMemoryEventLogPersistenceAdapter());

export const uiApi = express.Router();
uiApi.use('/admin', adminApi.api);
uiApi.use('/predicate-templates', predicateTemplatesApi.api);
uiApi.use('/predicate-tree', predicateTreeApi.api);

export async function initializeAsync() {
  await db.initializeAsync();

  const subscriptions = [
    PredicateTree.start(),
    predicateTreeApi.start(),
  ];

  return new Subscription(() => subscriptions.forEach(sub => sub.unsubscribe()));
}

export const api = express.Router();
api.use('/simulation', simulationApi);
api.use('/ui-api', uiApi);
api.use((req, res, next) => req.accepts('text/html') && !req.xhr ? res.sendFile(path.join(__dirname, 'ui', 'index.html')) : next());

api.use((err: any, _: express.Request, res: express.Response, next: express.NextFunction) => {
  if (res.headersSent) {
    return next(err);
  }

  return res.status(err.status || 500).render('500');
});
