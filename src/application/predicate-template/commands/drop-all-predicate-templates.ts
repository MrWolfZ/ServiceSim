import { Command } from 'src/application/infrastructure/cqrs';
import { PredicateTemplateAggregate } from 'src/domain/predicate-template';
import { versionedRepository } from 'src/infrastructure/db';

export type DropAllPredicateTemplatesCommandType = 'drop-all-predicate-templates';

export interface DropAllPredicateTemplatesCommand extends Command<DropAllPredicateTemplatesCommandType> { }

const repo = versionedRepository<PredicateTemplateAggregate>('predicate-template');

export async function dropAllPredicateTemplates(_: DropAllPredicateTemplatesCommand) {
  await repo.dropAll();
}
