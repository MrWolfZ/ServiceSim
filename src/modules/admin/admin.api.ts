import express from 'express';
import { commandHandler } from 'src/api-infrastructure/cqrs';
import { createDefaultPredicateTemplates } from 'src/application/predicate-template/commands/create-default-predicate-templates';
import { createEvent } from 'src/domain/infrastructure/events';
import { publish } from 'src/infrastructure/bus';
import { dropDB } from 'src/infrastructure/db';
import { dropAllEvents } from 'src/infrastructure/event-log';
import { ensureRootPredicateNodeExists } from '../development/predicate-tree/commands/ensure-root-predicate-node-exists';
import { createDefaultResponseGeneratorTemplates } from '../development/response-generator-template/response-generator-template.api';
import { setupMockData } from './mock-data';

export async function resetToDefaultData() {
  await dropDB();
  await dropAllEvents();

  await createDefaultPredicateTemplates({});
  await createDefaultResponseGeneratorTemplates();
  await ensureRootPredicateNodeExists();

  await setupMockData();

  await publish(createEvent('resetToDefaultDataAsync'));
}

export const adminApi = express.Router()
  .post('/resetToDefaultData', commandHandler(resetToDefaultData));
