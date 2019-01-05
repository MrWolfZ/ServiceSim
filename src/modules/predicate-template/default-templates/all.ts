import { PredicateTemplateData } from '../predicate-template.types';

export const ALL: PredicateTemplateData = {
  name: 'All',
  // tslint:disable-next-line:max-line-length
  description: 'Predicates based on this template match all requests unconditionally. They are usually used for fallback scenarios in case not other predicates match.',
  evalFunctionBody: 'return true;',
  parameters: [],
};
