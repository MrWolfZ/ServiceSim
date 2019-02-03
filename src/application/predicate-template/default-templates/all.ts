import { PredicateTemplateData } from 'src/domain/predicate-template';

export const ALL: PredicateTemplateData = {
  name: 'All',
  description: 'Match all requests unconditionally. Usually used for fallback scenarios in case not other predicates match.',
  tags: [],
  evalFunctionBody: 'return true;',
  parameters: [],
};
