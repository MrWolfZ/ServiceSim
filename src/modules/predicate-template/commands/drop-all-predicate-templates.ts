import { DB } from '../../../api-infrastructure';
import { PredicateTemplateAggregate } from '../predicate-template.types';

const repo = DB.versionedRepository<PredicateTemplateAggregate>('predicate-template');

export async function dropAllPredicateTemplates() {
  await repo.dropAll();
}
