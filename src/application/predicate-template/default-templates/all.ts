import { PredicateTemplateData } from 'src/domain/predicate-template';

export const ALL: PredicateTemplateData = {
  name: 'All',
  // tslint:disable-next-line:max-line-length
  description: 'Match all requests unconditionally. Usually used for fallback scenarios in case not other predicates match.',
  evalFunctionBody: 'return true;',
  parameters: [],
};
