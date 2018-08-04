import { Ask, Tell } from '../../infrastructure/infrastructure.dto';

import { PredicateTemplateDialogFormValue } from './predicate-template-dialog/predicate-template-dialog.dto';
import { PredicateTemplateTileDto } from './predicate-template-tile/predicate-template-tile.dto';

export interface PredicateTemplatesPageDto {
  tiles: PredicateTemplateTileDto[];
}

export const ASK_FOR_PREDICATE_TEMPLATES_PAGE_DTO = 'configuration/predicate-templates-page/ASK_FOR_PAGE_DTO';

export interface AskForPredicateTemplatesPageDto extends Ask<typeof ASK_FOR_PREDICATE_TEMPLATES_PAGE_DTO, PredicateTemplatesPageDto> { }

export function askForPredicateTemplatesPageDto(): AskForPredicateTemplatesPageDto {
  return {
    kind: ASK_FOR_PREDICATE_TEMPLATES_PAGE_DTO,
  };
}

export const TELL_TO_CREATE_OR_UPDATE_PREDICATE_TEMPLATE = 'configuration/predicate-templates-page/CREATE_OR_UPDATE_PREDICATE_TEMPLATE';

export interface TellToCreateOrUpdatePredicateTemplate extends Tell<typeof TELL_TO_CREATE_OR_UPDATE_PREDICATE_TEMPLATE, { templateId: string }> {
  templateId?: string;
  formValue: PredicateTemplateDialogFormValue;
}

export function tellToCreateOrUpdatePredicateTemplate(
  formValue: PredicateTemplateDialogFormValue,
  templateId?: string,
): TellToCreateOrUpdatePredicateTemplate {
  return {
    kind: TELL_TO_CREATE_OR_UPDATE_PREDICATE_TEMPLATE,
    formValue,
    templateId,
  };
}

export const TELL_TO_DELETE_PREDICATE_TEMPLATE = 'configuration/predicate-templates-page/DELETE_PREDICATE_TEMPLATE';

export interface DeletePredicateTemplateCommand extends Tell<typeof TELL_TO_DELETE_PREDICATE_TEMPLATE> {
  templateId: string;
}

export function createDeletePredicateTemplateCommand(templateId: string): DeletePredicateTemplateCommand {
  return {
    kind: TELL_TO_DELETE_PREDICATE_TEMPLATE,
    templateId,
  };
}
