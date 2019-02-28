import express, { Response } from 'express';
import path from 'path';
import { Subscription } from 'rxjs';
import { ensureRootPredicateNodeExists } from './application/predicate-tree/commands/ensure-root-predicate-node-exists';
import { registerHandlers } from './application/register-handlers';
import { processSimulationRequest } from './application/simulation/commands/process-simulation-request';
import { ServiceRequest } from './domain/service-invocation';
import { query, registerUniversalEventHandler, send } from './infrastructure/bus';
import { CONFIG } from './infrastructure/config';
import { initializeDB } from './infrastructure/db';
import { initializeEventLog } from './infrastructure/event-log';
import { logger } from './infrastructure/logging';
import { createFileSystemPersistenceAdapter } from './persistence/db/file-system';
import { inMemoryPersistenceAdapter } from './persistence/db/in-memory';
import { createFileSystemEventLogPersistenceAdapter } from './persistence/event-log/file-system';
import { inMemoryEventLogPersistenceAdapter } from './persistence/event-log/in-memory';
import { nullEventLogPersistenceAdapter } from './persistence/event-log/null';
import { assertNever, isFailure } from './util';

declare module 'http' {
  interface ServerResponse {
    flush(): void;
  }
}

export const uiApi = express.Router();
uiApi.post('/command', async (req, res) => {
  try {
    const result = await send(req.body);
    res.status(result ? 200 : 204).send(result);
  } catch (error) {
    writeErrorResponse(res, error);
  }
});

uiApi.post('/query', async (req, res) => {
  try {
    const result = await query(req.body);
    res.status(result ? 200 : 204).send(result);
  } catch (error) {
    writeErrorResponse(res, error);
  }
});

uiApi.get('/events', (req, res) => {
  req.setTimeout(60 * 60 * 1_000, () => void 0);

  const dispose = registerUniversalEventHandler(message => {
    res.write(`event: event\ndata: ${JSON.stringify(message)}\n\n`);
    res.flush();
  });

  req.on('close', dispose);
  req.on('error', dispose);
  req.on('end', dispose);

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
    switch (config.eventPersistence.adapter) {
      case 'Null':
        logger.info('using null event persistence adapter');
        return nullEventLogPersistenceAdapter;

      case 'InMemory':
        logger.info('using in-memory event persistence adapter');
        return inMemoryEventLogPersistenceAdapter;

      case 'FileSystem':
        logger.info(`using file system event persistence adapter with data dir ${config.eventPersistence.adapterConfig.dataDir}`);
        return await createFileSystemEventLogPersistenceAdapter(path.join(config.eventPersistence.adapterConfig.dataDir));

      default:
        return assertNever(config.eventPersistence.adapter);
    }
  })();

  await initializeEventLog({ adapter: eventLogPersistenceAdapter });

  const unsubHandlers = registerHandlers();

  await ensureRootPredicateNodeExists();

  return new Subscription(() => {
    logger.info('shutting down...');
    unsubHandlers();
  });
}

export const api = express.Router();

api.use('/simulation', async (req, res) => {
  const request: ServiceRequest = {
    path: req.path,
    body: req.body,
  };

  try {
    const timeoutInMillis = CONFIG.environment === 'development' ? 5000 : 60000;
    const { response } = await processSimulationRequest({ request, timeoutInMillis });
    res.status(response.statusCode).contentType(response.contentType).send(response.body);
  } catch (error) {
    writeErrorResponse(res, error);
  }
});

api.use('/ui-api', uiApi);
api.use((req, res, next) => req.accepts('text/html') && !req.xhr ? res.sendFile(path.join(__dirname, 'ui', 'index.html')) : next());

api.use((err: any, _: express.Request, res: express.Response, next: express.NextFunction) => {
  if (res.headersSent) {
    return next(err);
  }

  return res.status(err.status || 500).render('500');
});

export interface ErrorResponsePayload {
  messages: string[];
  stackTrace?: string;
}

export function writeErrorResponse(res: Response, error: any) {
  const isProduction = CONFIG.environment === 'production';

  let statusCode = 500;
  let messages: string[] = [isProduction ? 'an unknown error occured' : JSON.stringify(error)];
  let stackTrace: string | undefined;

  if (isFailure<string | string[]>(error)) {
    statusCode = 400;
    messages = Array.isArray(error.failure) ? error.failure : [error.failure];
    stackTrace = error.stackTrace;
  }

  if (error instanceof Error) {
    messages = [error.message];
    stackTrace = error.stack;
  }

  const payload: ErrorResponsePayload = {
    messages,
  };

  if (!isProduction) {
    payload.stackTrace = stackTrace;
  }

  res.status(statusCode).send(payload);
}
