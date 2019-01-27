import { PredicateTemplateData } from '../predicate-template.types';

export const ALL: PredicateTemplateData = {
  name: 'All',
  // tslint:disable-next-line:max-line-length
  description: 'Match all requests unconditionally. Usually used for fallback scenarios in case not other predicates match.',
  evalFunctionBody: 'return true;',
  parameters: [],
};
