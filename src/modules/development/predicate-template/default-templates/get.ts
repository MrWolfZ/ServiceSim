import { PredicateTemplateData } from '../predicate-template.types';

export const GET: PredicateTemplateData = {
  name: 'GET',
  description: 'Match all GET requests.',
  evalFunctionBody: 'return request.method.toUpperCase() === "GET"',
  parameters: [],
};
