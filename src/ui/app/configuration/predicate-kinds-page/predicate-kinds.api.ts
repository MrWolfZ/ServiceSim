import { Ask } from '../../infrastructure/infrastructure.dto';

import { ASK_FOR_PREDICATE_KINDS_PAGE_DTO_KIND, PredicateKindsPageDto } from './predicate-kinds.dto';

// TODO: properly load DTO
export async function askForPredicateKindsPageDto(_: Ask<typeof ASK_FOR_PREDICATE_KINDS_PAGE_DTO_KIND, PredicateKindsPageDto>): Promise<PredicateKindsPageDto> {
  return {
    predicateKindList: {
      items: [
        {
          name: 'All',
          // tslint:disable-next-line
          description: 'Predicates of this kind match all requests unconditionally. They are usually used for fallback scenarios in case not other predicates match.',
          evalFunctionBody: 'return true;',
        },
        {
          name: 'test 2',
          description: 'description 2',
          evalFunctionBody: 'function body 2',
        },
      ],
    },
  };
}
