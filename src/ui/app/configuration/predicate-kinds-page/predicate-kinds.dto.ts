import { Ask, Tell } from '../../infrastructure/infrastructure.dto';

import { PredicateKindListItemFormValue } from './predicate-kind-list/predicate-kind-list-item/predicate-kind-list-item.dto';
import { PredicateKindListDto } from './predicate-kind-list/predicate-kind-list.dto';

export interface PredicateKindsPageDto {
  predicateKindList: PredicateKindListDto;
}

export const ASK_FOR_PREDICATE_KINDS_PAGE_DTO_KIND = 'configuration/predicate-kinds-page/ASK_FOR_PAGE_DTO';

export interface AskForPredicateKindsPageDto extends Ask<typeof ASK_FOR_PREDICATE_KINDS_PAGE_DTO_KIND, PredicateKindsPageDto> { }

export const ASK_FOR_PREDICATE_KINDS_PAGE_DTO: AskForPredicateKindsPageDto = {
  kind: ASK_FOR_PREDICATE_KINDS_PAGE_DTO_KIND,
};

export const CREATE_NEW_PREDICATE_KIND_COMMAND_KIND = 'configuration/predicate-kinds-page/CREATE_NEW_PREDICATE_KIND';

export interface CreateNewPredicateKindCommand extends Tell<typeof CREATE_NEW_PREDICATE_KIND_COMMAND_KIND, { predicateKindId: string }> {
  formValue: PredicateKindListItemFormValue;
}

export function createCreateNewPredicateKindCommand(formValue: PredicateKindListItemFormValue): CreateNewPredicateKindCommand {
  return {
    kind: CREATE_NEW_PREDICATE_KIND_COMMAND_KIND,
    formValue,
  };
}
