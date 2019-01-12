import express from 'express';
import path from 'path';
import { Subscription } from 'rxjs';
import { bus, DB, logger } from './api-infrastructure';
import { createFileSystemPersistenceAdapter } from './api-infrastructure/db/adapters/file-system';
import { inMemoryPersistenceAdapter } from './api-infrastructure/db/adapters/in-memory';
import { CONFIG } from './config';
import { adminApi } from './modules/admin/admin.api';
import { predicateTemplatesApi } from './modules/predicate-template/predicate-template.api';
import { ensureRootPredicateNodeExists } from './modules/predicate-tree/predicate-node.api';
import { predicateTreeApi } from './modules/predicate-tree/predicate-tree.api';
import { simulationApi } from './modules/simulation/simulation.api';
import { assertNever } from './util';

declare module 'http' {
  interface ServerResponse {
    flush(): void;
  }
}

export const uiApi = express.Router();
uiApi.use('/admin', adminApi);
uiApi.use('/predicate-templates', predicateTemplatesApi);
uiApi.use('/predicate-tree', predicateTreeApi);

uiApi.get('/events', (req, res) => {
  const unsubscribe = bus.subscribe(undefined, message => {
    res.write(`event: event\ndata: ${JSON.stringify(message)}\n\n`);
    res.flush();
  });

  req.on('close', unsubscribe);
  req.on('error', unsubscribe);
  req.on('end', unsubscribe);

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });

  res.write('retry: 10000\n\n');
  res.flush();
});

export async function initialize() {
  const persistenceAdapter = (() => {
    switch (CONFIG.persistence.adapter) {
      case 'InMemory':
        logger.info('using in-memory persistence adapter');
        return inMemoryPersistenceAdapter;

      case 'FileSystem':
        logger.info(`using file system persistence adapter with data dir ${CONFIG.persistence.adapterConfig.dataDir}`);
        return createFileSystemPersistenceAdapter(CONFIG.persistence.adapterConfig.dataDir);

      default:
        return assertNever(CONFIG.persistence.adapter);
    }
  })();

  await DB.initialize({ adapter: persistenceAdapter });

  await ensureRootPredicateNodeExists();

  const subscriptions: Subscription[] = [];

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
