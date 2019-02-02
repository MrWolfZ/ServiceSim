import { createQueryFn, Query } from 'src/application/infrastructure/cqrs';
import { PredicateTemplateAggregate } from 'src/domain/predicate-template';
import { versionedRepository } from 'src/infrastructure/db';
import { keys } from 'src/util';
import { PredicateTemplateDto } from './get-all-predicate-templates';

export type GetPredicateTemplatesByIdsAndVersionsQueryType = 'get-predicate-templates-by-ids-and-versions';

export interface GetPredicateTemplatesByIdsAndVersionsQuery extends Query<GetPredicateTemplatesByIdsAndVersionsQueryType, PredicateTemplateDto[]> {
  idsAndVersions: { [templateId: string]: number[] };
}

const repo = versionedRepository<PredicateTemplateAggregate>('predicate-template');

export async function getPredicateTemplatesByIdsAndVersionsHandler({ idsAndVersions }: GetPredicateTemplatesByIdsAndVersionsQuery) {
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

export const getPredicateTemplatesByIdsAndVersions = createQueryFn<GetPredicateTemplatesByIdsAndVersionsQuery>('get-predicate-templates-by-ids-and-versions');
