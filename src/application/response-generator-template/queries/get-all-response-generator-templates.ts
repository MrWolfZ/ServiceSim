import { ResponseGeneratorTemplateAggregate, ResponseGeneratorTemplateData } from 'src/domain/response-generator-template';
import { createQueryFn, Query } from 'src/infrastructure/cqrs';
import { versionedRepository } from 'src/infrastructure/db';

export type GetAllResponseGeneratorTemplatesQueryType = 'get-all-response-generator-templates';

export interface GetAllResponseGeneratorTemplatesQuery extends Query<GetAllResponseGeneratorTemplatesQueryType, ResponseGeneratorTemplateDto[]> { }

export interface ResponseGeneratorTemplateDto extends ResponseGeneratorTemplateData {
  id: string;
  version: number;
}

const repo = versionedRepository<ResponseGeneratorTemplateAggregate>('response-generator-template');

export async function getAllResponseGeneratorTemplatesHandler(_: GetAllResponseGeneratorTemplatesQuery) {
  const allTemplates = await repo.query.all();

  return allTemplates.map<ResponseGeneratorTemplateDto>(t => ({
    id: t.id,
    version: t.$metadata.version,
    name: t.name,
    description: t.description,
    tags: t.tags,
    generatorFunctionBody: t.generatorFunctionBody,
    parameters: t.parameters,
  }));
}

export const getAllResponseGeneratorTemplates = createQueryFn<GetAllResponseGeneratorTemplatesQuery>('get-all-response-generator-templates');
