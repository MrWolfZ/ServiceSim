import { Ask, Tell } from '../../infrastructure/infrastructure.dto';

import { PredicateKindDialogFormValue } from './predicate-kind-dialog/predicate-kind-dialog.dto';
import { PredicateKindTileDto } from './predicate-kind-tile/predicate-kind-tile.dto';

export interface PredicateKindsPageDto {
  tiles: PredicateKindTileDto[];
}

export const ASK_FOR_PREDICATE_KINDS_PAGE_DTO = 'configuration/predicate-kinds-page/ASK_FOR_PAGE_DTO';

export interface AskForPredicateKindsPageDto extends Ask<typeof ASK_FOR_PREDICATE_KINDS_PAGE_DTO, PredicateKindsPageDto> { }

export const askForPredicateKindsPageDto = (): AskForPredicateKindsPageDto => ({
  kind: ASK_FOR_PREDICATE_KINDS_PAGE_DTO,
});

export const TELL_TO_CREATE_OR_UPDATE_PREDICATE_KIND = 'configuration/predicate-kinds-page/CREATE_OR_UPDATE_PREDICATE_KIND';

export interface TellToCreateOrUpdatePredicateKind extends Tell<typeof TELL_TO_CREATE_OR_UPDATE_PREDICATE_KIND, { predicateKindId: string }> {
  predicateKindId?: string;
  formValue: PredicateKindDialogFormValue;
}

export function tellToCreateOrUpdatePredicateKind(formValue: PredicateKindDialogFormValue, predicateKindId?: string): TellToCreateOrUpdatePredicateKind {
  return {
    kind: TELL_TO_CREATE_OR_UPDATE_PREDICATE_KIND,
    formValue,
    predicateKindId,
  };
}

export const TELL_TO_DELETE_PREDICATE_KIND = 'configuration/predicate-kinds-page/DELETE_PREDICATE_KIND';

export interface DeletePredicateKindCommand extends Tell<typeof TELL_TO_DELETE_PREDICATE_KIND> {
  predicateKindId: string;
}

export function createDeletePredicateKindCommand(predicateKindId: string): DeletePredicateKindCommand {
  return {
    kind: TELL_TO_DELETE_PREDICATE_KIND,
    predicateKindId,
  };
}
