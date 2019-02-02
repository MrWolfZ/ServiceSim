import { Command, createCommandFn } from 'src/application/infrastructure/cqrs';
import { createDefaultPredicateTemplates } from 'src/application/predicate-template/commands/create-default-predicate-templates';
import { createDefaultResponseGeneratorTemplates } from 'src/application/response-generator-template/commands/create-default-response-generator-templates';
import { createEvent } from 'src/domain/infrastructure/events';
import { publish } from 'src/infrastructure/bus';
import { dropDB } from 'src/infrastructure/db';
import { dropAllEvents } from 'src/infrastructure/event-log';
import { ensureRootPredicateNodeExists } from 'src/modules/development/predicate-tree/commands/ensure-root-predicate-node-exists';
import { setupMockData } from './mock-data';

export type ResetToDefaultDataCommandType = 'reset-to-default-data';

export interface ResetToDefaultDataCommand extends Command<ResetToDefaultDataCommandType> { }

export async function resetToDefaultDataHandler(_: ResetToDefaultDataCommand) {
  await dropDB();
  await dropAllEvents();

  await createDefaultPredicateTemplates({});
  await createDefaultResponseGeneratorTemplates({});
  await ensureRootPredicateNodeExists();

  await setupMockData();

  await publish(createEvent('resetToDefaultDataAsync'));

}

export const resetToDefaultData = createCommandFn<ResetToDefaultDataCommand>('reset-to-default-data');
