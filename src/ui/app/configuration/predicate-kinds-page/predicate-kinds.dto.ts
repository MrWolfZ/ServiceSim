import { Ask, Tell } from '../../infrastructure/infrastructure.dto';

import { PredicateKindListItemFormValue } from './predicate-kind-list/predicate-kind-list-item/predicate-kind-list-item.dto';
import { PredicateKindListDto } from './predicate-kind-list/predicate-kind-list.dto';

export interface PredicateKindsPageDto {
  predicateKindList: PredicateKindListDto;
}

export const ASK_FOR_PREDICATE_KINDS_PAGE_DTO = 'configuration/predicate-kinds-page/ASK_FOR_PAGE_DTO';

export interface AskForPredicateKindsPageDto extends Ask<typeof ASK_FOR_PREDICATE_KINDS_PAGE_DTO, PredicateKindsPageDto> { }

export const askForPredicateKindsPageDto = (): AskForPredicateKindsPageDto => ({
  kind: ASK_FOR_PREDICATE_KINDS_PAGE_DTO,
});

export const TELL_TO_CREATE_OR_UPDATE_PREDICATE_KIND = 'configuration/predicate-kinds-page/CREATE_OR_UPDATE_PREDICATE_KIND';

export interface TellToCreateOrUpdatePredicateKind extends Tell<typeof TELL_TO_CREATE_OR_UPDATE_PREDICATE_KIND, { predicateKindId: string }> {
  predicateKindId?: string;
  formValue: PredicateKindListItemFormValue;
}

export function tellToCreateOrUpdatePredicateKind(formValue: PredicateKindListItemFormValue, predicateKindId?: string): TellToCreateOrUpdatePredicateKind {
  return {
    kind: TELL_TO_CREATE_OR_UPDATE_PREDICATE_KIND,
    formValue,
    predicateKindId,
  };
}

export const DELETE_PREDICATE_KIND_COMMAND_KIND = 'configuration/predicate-kinds-page/DELETE_PREDICATE_KIND';

export interface DeletePredicateKindCommand extends Tell<typeof DELETE_PREDICATE_KIND_COMMAND_KIND> {
  predicateKindId: string;
}

export function createDeletePredicateKindCommand(predicateKindId: string): DeletePredicateKindCommand {
  return {
    kind: DELETE_PREDICATE_KIND_COMMAND_KIND,
    predicateKindId,
  };
}
