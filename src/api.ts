import express from 'express';
import path from 'path';
import { Subscription } from 'rxjs';
import { getUnfilteredLiveEventStream, initializeDB, initializeEventLog, logger } from './api-infrastructure';
import { createFileSystemPersistenceAdapter } from './api-infrastructure/db/persistence/file-system';
import { inMemoryPersistenceAdapter } from './api-infrastructure/db/persistence/in-memory';
import { createFileSystemEventLogPersistenceAdapter } from './api-infrastructure/event-log/persistence/file-system';
import { inMemoryEventLogPersistenceAdapter } from './api-infrastructure/event-log/persistence/in-memory';
import { CONFIG } from './config';
import { adminApi } from './modules/admin/admin.api';
import { predicateTemplatesApi } from './modules/predicate-template/predicate-template.api';
import { ensureRootPredicateNodeExists } from './modules/predicate-tree/commands/ensure-root-predicate-node-exists';
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
  const sub = getUnfilteredLiveEventStream().subscribe(message => {
    res.write(`event: event\ndata: ${JSON.stringify(message)}\n\n`);
    res.flush();
  });

  req.on('close', () => sub.unsubscribe());
  req.on('error', () => sub.unsubscribe());
  req.on('end', () => sub.unsubscribe());

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });

  res.write('retry: 2000\n\n');
  res.flush();
});

export async function initialize(config = CONFIG) {
  const persistenceAdapter = (() => {
    switch (config.persistence.adapter) {
      case 'InMemory':
        logger.info('using in-memory persistence adapter');
        return inMemoryPersistenceAdapter;

      case 'FileSystem':
        logger.info(`using file system persistence adapter with data dir ${config.persistence.adapterConfig.dataDir}`);
        return createFileSystemPersistenceAdapter(config.persistence.adapterConfig.dataDir);

      default:
        return assertNever(config.persistence.adapter);
    }
  })();

  await initializeDB({ adapter: persistenceAdapter });

  const eventLogPersistenceAdapter = await (async () => {
    switch (config.persistence.adapter) {
      case 'InMemory':
        logger.info('using in-memory event persistence adapter');
        return inMemoryEventLogPersistenceAdapter;

      case 'FileSystem':
        logger.info(`using file system event persistence adapter with data dir ${config.eventPersistence.adapterConfig.dataDir}`);
        return await createFileSystemEventLogPersistenceAdapter(path.join(config.eventPersistence.adapterConfig.dataDir));

      default:
        return assertNever(config.persistence.adapter);
    }
  })();

  await initializeEventLog({ adapter: eventLogPersistenceAdapter });

  await ensureRootPredicateNodeExists();

  return new Subscription(() => { });
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
