import express from 'express';
import { bus, commandHandler, CommandHandler } from '../../api-infrastructure';
import * as predicateTemplateApi from '../predicate-template/predicate-template.api';
import { setupMockData } from './mock-data';

export const resetToDefaultDataAsync: CommandHandler<void> = async () => {
  await predicateTemplateApi.dropAllAsync();

  await predicateTemplateApi.createDefaultTemplatesAsync();
  await setupMockData();

  bus.publish(undefined, { payload: 'resetToDefaultDataAsync' });
};

export const api = express.Router();
api.post('/resetToDefaultData', commandHandler(resetToDefaultDataAsync));
