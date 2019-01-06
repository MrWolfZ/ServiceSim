import express from 'express';
import { bus, commandHandler, CommandHandler } from '../../api-infrastructure';
import * as predicateTemplateApi from '../predicate-template/predicate-template.api';
import * as predicateNodeApi from '../predicate-tree/predicate-node.api';
import * as responseGeneratorTemplateApi from '../response-generator-template/response-generator-template.api';
import { setupMockData } from './mock-data';

export const resetToDefaultDataAsync: CommandHandler<void> = async () => {
  await predicateNodeApi.dropAllAsync();
  await predicateTemplateApi.dropAllAsync();
  await responseGeneratorTemplateApi.dropAllAsync();

  await predicateTemplateApi.createDefaultTemplatesAsync();
  await responseGeneratorTemplateApi.createDefaultTemplatesAsync();
  await predicateNodeApi.ensureRootNodeExistsAsync();

  await setupMockData();

  bus.publish(undefined, { payload: 'resetToDefaultDataAsync' });
};

export const api = express.Router();
api.post('/resetToDefaultData', commandHandler(resetToDefaultDataAsync));
