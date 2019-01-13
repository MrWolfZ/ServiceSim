import express from 'express';
import { commandHandler, eventBus } from '../../api-infrastructure';
import { createDefaultPredicateTemplates } from '../predicate-template/commands/create-default-predicate-templates';
import { dropAllPredicateTemplates } from '../predicate-template/commands/drop-all-predicate-templates';
import { dropAllPredicateNodes, ensureRootPredicateNodeExists } from '../predicate-tree/predicate-node.api';
import { createDefaultResponseGeneratorTemplates, dropAllResponseGeneratorTemplates } from '../response-generator-template/response-generator-template.api';
import { dropAllServiceInvocations } from '../service-invocation/service-invocation.api';
import { setupMockData } from './mock-data';

export async function resetToDefaultData() {
  await dropAllPredicateNodes();
  await dropAllPredicateTemplates();
  await dropAllResponseGeneratorTemplates();
  await dropAllServiceInvocations();

  await createDefaultPredicateTemplates();
  await createDefaultResponseGeneratorTemplates();
  await ensureRootPredicateNodeExists();

  await setupMockData();

  eventBus.publish(eventBus.createEvent('resetToDefaultDataAsync'));
}

export const adminApi = express.Router()
  .post('/resetToDefaultData', commandHandler(resetToDefaultData));
