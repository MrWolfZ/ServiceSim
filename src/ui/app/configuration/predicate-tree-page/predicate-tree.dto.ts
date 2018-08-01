import { Ask } from '../../infrastructure/infrastructure.dto';

import { PredicateNodeDto } from './predicate-node/predicate-node.dto';

import { PredicateNodeDetailsDto } from './predicate-node-details/predicate-node-details.dto';

export interface PredicateTreePageDto {
  topLevelNodes: PredicateNodeDto[];
  nodeDetailsByNodeId: {
    [nodeId: string]: PredicateNodeDetailsDto;
  };
}

export const ASK_FOR_PREDICATE_TREE_PAGE_DTO_KIND = 'configuration/predicate-tree-page/ASK_FOR_PAGE_DTO';

export interface AskForPredicateTreePageDto extends Ask<typeof ASK_FOR_PREDICATE_TREE_PAGE_DTO_KIND, PredicateTreePageDto> { }

export const ASK_FOR_PREDICATE_TREE_PAGE_DTO: AskForPredicateTreePageDto = {
  kind: ASK_FOR_PREDICATE_TREE_PAGE_DTO_KIND,
};
