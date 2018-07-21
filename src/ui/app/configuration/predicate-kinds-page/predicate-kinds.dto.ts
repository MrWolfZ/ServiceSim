import { Ask } from '../../infrastructure/infrastructure.dto';

import { PredicateKindListDto } from './predicate-kind-list/predicate-kind-list.dto';

export interface PredicateKindsPageDto {
  predicateKindList: PredicateKindListDto;
}

export const ASK_FOR_PREDICATE_KINDS_PAGE_DTO_KIND = 'configuration/predicate-kinds-page/ASK_FOR_PAGE_DTO';

export interface AskForPredicateKindsPageDto extends Ask<typeof ASK_FOR_PREDICATE_KINDS_PAGE_DTO_KIND, PredicateKindsPageDto> { }

export const ASK_FOR_PREDICATE_KINDS_PAGE_DTO: AskForPredicateKindsPageDto = {
  kind: ASK_FOR_PREDICATE_KINDS_PAGE_DTO_KIND,
};
