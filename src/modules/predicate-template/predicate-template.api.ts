import express from 'express';
import { Subscription } from 'rxjs';
import { commandHandler, queryHandler } from '../../api-infrastructure';
import { createDefaultPredicateTemplates } from './commands/create-default-predicate-templates';
import { createPredicateTemplate, createPredicateTemplateConstraints } from './commands/create-predicate-template';
import { deletePredicateTemplate, deletePredicateTemplateConstraints } from './commands/delete-predicate-template';
import { updatePredicateTemplate, updatePredicateTemplateConstraints } from './commands/update-predicate-template';
import { getAllPredicateTemplates } from './queries/get-all-predicate-templates';

export async function initializePredicateTemplatesApi() {
  const subscriptions = [
    await getAllPredicateTemplates.initialize(),
  ];

  return new Subscription(() => subscriptions.forEach(sub => sub.unsubscribe()));
}

export const predicateTemplatesApi = express.Router()
  .get('/', queryHandler(getAllPredicateTemplates))
  .post('/create', commandHandler(createPredicateTemplate, createPredicateTemplateConstraints))
  .post('/update', commandHandler(updatePredicateTemplate, updatePredicateTemplateConstraints))
  .post('/delete', commandHandler(deletePredicateTemplate, deletePredicateTemplateConstraints))
  .post('/createDefaultTemplates', commandHandler(createDefaultPredicateTemplates));
