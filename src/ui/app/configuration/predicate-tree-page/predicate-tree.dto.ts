import { Ask } from '../../infrastructure/infrastructure.dto';

import { PredicateNodeDto } from './domain/predicate-node/predicate-node.dto';

export interface PredicateTreePageDto {
  nodes: PredicateNodeDto[];
}

export const ASK_FOR_PREDICATE_TREE_PAGE_DTO_KIND = 'configuration/predicate-tree-page/ASK_FOR_PAGE_DTO';

export interface AskForPredicateTreePageDto extends Ask<typeof ASK_FOR_PREDICATE_TREE_PAGE_DTO_KIND, PredicateTreePageDto> { }

export const ASK_FOR_PREDICATE_TREE_PAGE_DTO: AskForPredicateTreePageDto = {
  kind: ASK_FOR_PREDICATE_TREE_PAGE_DTO_KIND,
};
