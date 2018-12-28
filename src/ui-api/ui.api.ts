import express from 'express';
import { Subscription } from 'rxjs';
import * as predicateTemplatesApi from './predicate-templates.api';

export function start() {
  const subscriptions = [
    predicateTemplatesApi.start(),
  ];

  return new Subscription(() => subscriptions.forEach(sub => sub.unsubscribe()));
}

export const api = express.Router();
api.use('/predicate-templates', predicateTemplatesApi.api);
