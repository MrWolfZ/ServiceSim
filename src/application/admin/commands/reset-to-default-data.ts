import { createDefaultPredicateTemplates } from 'src/application/predicate-template/commands/create-default-predicate-templates';
import { ensureRootPredicateNodeExists } from 'src/application/predicate-tree/commands/ensure-root-predicate-node-exists';
import { createDefaultResponseGeneratorTemplates } from 'src/application/response-generator-template/commands/create-default-response-generator-templates';
import { createEvent } from 'src/domain/infrastructure/events';
import { publish } from 'src/infrastructure/bus';
import { Command, createCommandFn } from 'src/infrastructure/cqrs';
import { dropDB } from 'src/infrastructure/db';
import { dropAllEvents } from 'src/infrastructure/event-log';
import { getActiveEngineConfigurationPersistenceStrategy } from 'src/infrastructure/persistence/engine-configuration/engine-configuration-persistence-strategy';
import { setupMockData } from './mock-data';

export type ResetToDefaultDataCommandType = 'reset-to-default-data';

export interface ResetToDefaultDataCommand extends Command<ResetToDefaultDataCommandType> { }

export async function resetToDefaultDataHandler(_: ResetToDefaultDataCommand) {
  await dropDB();
  await dropAllEvents();

  await getActiveEngineConfigurationPersistenceStrategy().deleteAllData();

  await createDefaultPredicateTemplates();
  await createDefaultResponseGeneratorTemplates();
  await ensureRootPredicateNodeExists();

  await setupMockData();

  await publish({ ...createEvent('resetToDefaultDataAsync'), transient: true });
}

export const resetToDefaultData = createCommandFn<ResetToDefaultDataCommand>('reset-to-default-data');
