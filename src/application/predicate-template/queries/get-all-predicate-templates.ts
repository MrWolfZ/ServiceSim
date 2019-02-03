import { createQueryFn, Query } from 'src/application/infrastructure/cqrs';
import { PredicateTemplateAggregate, PredicateTemplateData } from 'src/domain/predicate-template';
import { versionedRepository } from 'src/infrastructure/db';

export type GetAllPredicateTemplatesQueryType = 'get-all-predicate-templates';

export interface GetAllPredicateTemplatesQuery extends Query<GetAllPredicateTemplatesQueryType, PredicateTemplateDto[]> { }

export interface PredicateTemplateDto extends PredicateTemplateData {
  id: string;
  version: number;
}

const repo = versionedRepository<PredicateTemplateAggregate>('predicate-template');

export async function getAllPredicateTemplatesHandler(_: GetAllPredicateTemplatesQuery) {
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

export const getAllPredicateTemplates = createQueryFn<GetAllPredicateTemplatesQuery>('get-all-predicate-templates');