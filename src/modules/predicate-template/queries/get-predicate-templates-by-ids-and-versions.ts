import { DB } from '../../../api-infrastructure';
import { keys } from '../../../util';
import { PredicateTemplateAggregate, PredicateTemplateDto } from '../predicate-template.types';

const repo = DB.versionedRepository<PredicateTemplateAggregate>('predicate-template');

export async function getPredicateTemplatesByIdsAndVersions(idsAndVersions: { [templateId: string]: number[] }) {
  const templates = await Promise.all(
    keys(idsAndVersions).flatMap(id => idsAndVersions[id].map(v => repo.query.byIdAndVersion(id, v)))
  );

  return templates.map<PredicateTemplateDto>(t => ({
    id: t.id,
    version: t.$metadata.version,
    name: t.name,
    description: t.description,
    evalFunctionBody: t.evalFunctionBody,
    parameters: t.parameters,
  }));
}
