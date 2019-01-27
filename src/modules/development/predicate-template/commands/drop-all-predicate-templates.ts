import { versionedRepository } from 'src/api-infrastructure';
import { PredicateTemplateAggregate } from '../predicate-template.types';

const repo = versionedRepository<PredicateTemplateAggregate>('predicate-template');

export async function dropAllPredicateTemplates() {
  await repo.dropAll();
}
