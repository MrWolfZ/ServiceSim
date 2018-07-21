import { Ask } from 'app/infrastructure';

import { PredicateKindListDto } from './predicate-kind-list';

export interface PredicateKindsPageDto {
  predicateKindList: PredicateKindListDto;
}

export const ASK_FOR_PAGE_DTO_KIND = 'configuration/predicate-kinds-page/ASK_FOR_PAGE_DTO';

export interface AskForPageDto extends Ask<typeof ASK_FOR_PAGE_DTO_KIND, PredicateKindsPageDto> { }

export const ASK_FOR_PAGE_DTO: AskForPageDto = {
  kind: ASK_FOR_PAGE_DTO_KIND,
};
