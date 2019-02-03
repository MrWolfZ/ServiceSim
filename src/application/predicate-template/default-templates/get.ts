import { PredicateTemplateData } from 'src/domain/predicate-template';

export const GET: PredicateTemplateData = {
  name: 'GET',
  description: 'Match all GET requests.',
  tags: ['method', 'get'],
  evalFunctionBody: 'return request.method.toUpperCase() === "GET"',
  parameters: [],
};
