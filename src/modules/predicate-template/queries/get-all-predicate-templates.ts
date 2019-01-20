import { versionedRepository } from '../../../api-infrastructure';
import { PredicateTemplateAggregate, PredicateTemplateDto } from '../predicate-template.types';

const repo = versionedRepository<PredicateTemplateAggregate>('predicate-template');

export async function getAllPredicateTemplates() {
  const allTemplates = await repo.query.all();

  return allTemplates.map<PredicateTemplateDto>(t => ({
    id: t.id,
    version: t.$metadata.version,
    name: t.name,
    description: t.description,
    evalFunctionBody: t.evalFunctionBody,
    parameters: t.parameters,
  }));
}
