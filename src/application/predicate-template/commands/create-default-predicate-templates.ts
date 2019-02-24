import { Command, createCommandFn } from 'src/infrastructure/cqrs';
import { keys } from 'src/util';
import * as DEFAULT_TEMPLATES from '../default-templates';
import { createPredicateTemplate } from './create-predicate-template';

export type CreateDefaultPredicateTemplatesCommandType = 'create-default-predicate-templates';

export interface CreateDefaultPredicateTemplatesCommand extends Command<CreateDefaultPredicateTemplatesCommandType> { }

export async function createDefaultPredicateTemplatesHandler(_: CreateDefaultPredicateTemplatesCommand) {
  for (const key of keys(DEFAULT_TEMPLATES)) {
    await createPredicateTemplate(DEFAULT_TEMPLATES[key]);
  }
}

export const createDefaultPredicateTemplates = createCommandFn<CreateDefaultPredicateTemplatesCommand>('create-default-predicate-templates');
