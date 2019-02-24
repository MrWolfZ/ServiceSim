import { Command, createCommandFn } from 'src/infrastructure/cqrs';
import { keys } from 'src/util';
import * as DEFAULT_TEMPLATES from '../default-templates';
import { createResponseGeneratorTemplate } from './create-response-generator-template';

export type CreateDefaultResponseGeneratorTemplatesCommandType = 'create-default-response-generator-templates';

export interface CreateDefaultResponseGeneratorTemplatesCommand extends Command<CreateDefaultResponseGeneratorTemplatesCommandType> { }

export async function createDefaultResponseGeneratorTemplatesHandler(_: CreateDefaultResponseGeneratorTemplatesCommand) {
  for (const key of keys(DEFAULT_TEMPLATES)) {
    await createResponseGeneratorTemplate(DEFAULT_TEMPLATES[key]);
  }
}

export const createDefaultResponseGeneratorTemplates =
  createCommandFn<CreateDefaultResponseGeneratorTemplatesCommand>('create-default-response-generator-templates');
