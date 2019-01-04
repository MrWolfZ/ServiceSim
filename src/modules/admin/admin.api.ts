import express from 'express';
import { commandHandler, CommandHandler } from '../../api-infrastructure';
import * as predicateTemplateApi from '../predicate-template/predicate-template.api';
import { setupMockData } from './mock-data';

export const resetToDefaultDataAsync: CommandHandler<void> = async () => {
  await predicateTemplateApi.deleteAllAsync();

  await setupMockData();
};

export const api = express.Router();
api.post('/resetToDefaultData', commandHandler(resetToDefaultDataAsync));
