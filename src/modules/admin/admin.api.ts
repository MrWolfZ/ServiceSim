import express from 'express';
import { commandHandler, createEvent, dropAllEvents, dropDB, publishTransientEvents } from '../../api-infrastructure';
import { createDefaultPredicateTemplates } from '../predicate-template/commands/create-default-predicate-templates';
import { ensureRootPredicateNodeExists } from '../predicate-tree/commands/ensure-root-predicate-node-exists';
import { createDefaultResponseGeneratorTemplates } from '../response-generator-template/response-generator-template.api';
import { setupMockData } from './mock-data';

export async function resetToDefaultData() {
  await dropDB();
  await dropAllEvents();

  await createDefaultPredicateTemplates();
  await createDefaultResponseGeneratorTemplates();
  await ensureRootPredicateNodeExists();

  await setupMockData();

  await publishTransientEvents(createEvent('resetToDefaultDataAsync'));
}

export const adminApi = express.Router()
  .post('/resetToDefaultData', commandHandler(resetToDefaultData));
