import express from 'express';
import { bus, commandHandler } from '../../api-infrastructure';
import { createDefaultPredicateTemplatesAsync, dropAllPredicateTemplates } from '../predicate-template/predicate-template.api';
import { dropAllPredicateNodes, ensureRootPredicateNodeExists } from '../predicate-tree/predicate-node.api';
import { createDefaultResponseGeneratorTemplates, dropAllResponseGeneratorTemplates } from '../response-generator-template/response-generator-template.api';
import { dropAllServiceInvocations } from '../service-invocation/service-invocation.api';
import { setupMockData } from './mock-data';

export async function resetToDefaultData() {
  await dropAllPredicateNodes();
  await dropAllPredicateTemplates();
  await dropAllResponseGeneratorTemplates();
  await dropAllServiceInvocations();

  await createDefaultPredicateTemplatesAsync();
  await createDefaultResponseGeneratorTemplates();
  await ensureRootPredicateNodeExists();

  await setupMockData();

  bus.publish(undefined, { payload: 'resetToDefaultDataAsync' });
}

export const adminApi = express.Router()
  .post('/resetToDefaultData', commandHandler(resetToDefaultData));
