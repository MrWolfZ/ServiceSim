import express from 'express';
import { commandHandler, queryHandler } from 'src/api-infrastructure';
import { createDefaultPredicateTemplates } from './commands/create-default-predicate-templates';
import { createPredicateTemplate, createPredicateTemplateConstraints } from './commands/create-predicate-template';
import { deletePredicateTemplate, deletePredicateTemplateConstraints } from './commands/delete-predicate-template';
import { updatePredicateTemplate, updatePredicateTemplateConstraints } from './commands/update-predicate-template';
import { getAllPredicateTemplates } from './queries/get-all-predicate-templates';

export const predicateTemplatesApi = express.Router()
  .get('/', queryHandler(getAllPredicateTemplates))
  .post('/create', commandHandler(createPredicateTemplate, createPredicateTemplateConstraints))
  .post('/update', commandHandler(updatePredicateTemplate, updatePredicateTemplateConstraints))
  .post('/delete', commandHandler(deletePredicateTemplate, deletePredicateTemplateConstraints))
  .post('/createDefaultTemplates', commandHandler(createDefaultPredicateTemplates));
