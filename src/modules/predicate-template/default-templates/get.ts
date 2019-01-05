import { PredicateTemplateData } from '../predicate-template.types';

export const GET: PredicateTemplateData = {
  name: 'GET',
  description: 'Predicates based on this template match all GET requests.',
  evalFunctionBody: 'return request.method.toUpperCase() === "GET"',
  parameters: [],
};
