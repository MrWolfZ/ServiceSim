import { ResponseGeneratorTemplateAggregate } from 'src/domain/response-generator-template';
import { createQueryFn, Query } from 'src/infrastructure/cqrs';
import { versionedRepository } from 'src/infrastructure/db';
import { keys } from 'src/util';
import { ResponseGeneratorTemplateDto } from './get-all-response-generator-templates';

export type GetResponseGeneratorTemplatesByIdsAndVersionsQueryType = 'get-response-generator-templates-by-ids-and-versions';

export interface GetResponseGeneratorTemplatesByIdsAndVersionsQuery
  extends Query<GetResponseGeneratorTemplatesByIdsAndVersionsQueryType, ResponseGeneratorTemplateDto[]> {
  idsAndVersions: { [templateId: string]: number[] };
}

const repo = versionedRepository<ResponseGeneratorTemplateAggregate>('response-generator-template');

export async function getResponseGeneratorTemplatesByIdsAndVersionsHandler({ idsAndVersions }: GetResponseGeneratorTemplatesByIdsAndVersionsQuery) {
  const templates = await Promise.all(
    keys(idsAndVersions).flatMap(id => idsAndVersions[id].map(v => repo.query.byIdAndVersion(id, v)))
  );

  return templates.map<ResponseGeneratorTemplateDto>(t => ({
    id: t.id,
    version: t.$metadata.version,
    name: t.name,
    description: t.description,
    tags: t.tags,
    generatorFunctionBody: t.generatorFunctionBody,
    parameters: t.parameters,
  }));
}

export const getResponseGeneratorTemplatesByIdsAndVersions =
  createQueryFn<GetResponseGeneratorTemplatesByIdsAndVersionsQuery>('get-response-generator-templates-by-ids-and-versions');
