import { createFormGroupState } from 'ngrx-forms';

import { PredicateTemplate, PredicateTemplateCreatedOrUpdated, PredicateTemplateDeleted } from '../../../../domain';
import { EventLog, failure, success } from '../../../../infrastructure';

import { Ask, Tell } from '../../infrastructure/infrastructure.dto';
import { validatePredicateTemplateDialog } from './predicate-template-dialog/predicate-template-dialog.validation';
import { PredicateTemplateTileDto } from './predicate-template-tile/predicate-template-tile.dto';
import {
  ASK_FOR_PREDICATE_TEMPLATES_PAGE_DTO,
  AskForPredicateTemplatesPageDto,
  DeletePredicateTemplateCommand,
  PredicateTemplatesPageDto,
  TELL_TO_CREATE_OR_UPDATE_PREDICATE_TEMPLATE,
  TELL_TO_DELETE_PREDICATE_TEMPLATE,
  TellToCreateOrUpdatePredicateTemplate,
} from './predicate-templates.dto';

const SUBSCRIBED_EVENT_KINDS: SubscribedEvents['kind'][] = [
  PredicateTemplateCreatedOrUpdated.KIND,
  PredicateTemplateDeleted.KIND,
];

type SubscribedEvents =
  | PredicateTemplateCreatedOrUpdated
  | PredicateTemplateDeleted
  ;

let dto: PredicateTemplatesPageDto = {
  tiles: [],
};

export class PredicateTemplatesApi {
  static start() {
    return EventLog.subscribeToStream<SubscribedEvents>(SUBSCRIBED_EVENT_KINDS, {
      [PredicateTemplateCreatedOrUpdated.KIND]: ev => {
        const item: PredicateTemplateTileDto = {
          templateId: ev.templateId,
          name: ev.name,
          description: ev.description,
          evalFunctionBody: ev.evalFunctionBody,
          parameters: ev.parameters,
        };

        const tiles = [
          ...dto.tiles.filter(i => i.templateId !== item.templateId),
          item,
        ].sort((l, r) => l.name.localeCompare(r.name));

        dto = {
          ...dto,
          tiles,
        };

        return;
      },
      [PredicateTemplateDeleted.KIND]: ev => {
        const tiles = dto.tiles.filter(i => i.templateId !== ev.templateId);

        dto = {
          ...dto,
          tiles,
        };

        return;
      },
    });
  }

  static async matchAsk(ask: Ask<string, any>) {
    switch (ask.kind) {
      case ASK_FOR_PREDICATE_TEMPLATES_PAGE_DTO:
        return success(dto);

      default:
        return failure();
    }
  }

  static async askForPageDto(_: AskForPredicateTemplatesPageDto) {
    return dto;
  }

  static async matchTell(tell: Tell<string, any>) {
    switch (tell.kind) {
      case TELL_TO_CREATE_OR_UPDATE_PREDICATE_TEMPLATE:
        return success(await PredicateTemplatesApi.createOrUpdatePredicateKind(tell as TellToCreateOrUpdatePredicateTemplate));

      case TELL_TO_DELETE_PREDICATE_TEMPLATE:
        return success(await PredicateTemplatesApi.deletePredicateKind(tell as DeletePredicateTemplateCommand));

      default:
        return failure();
    }
  }

  static async createOrUpdatePredicateKind(tell: TellToCreateOrUpdatePredicateTemplate) {
    const isValid = validatePredicateTemplateDialog(createFormGroupState('', tell.formValue)).isValid;

    if (!isValid) {
      return failure();
    }

    const predicateKind = await (async () => {
      if (!!tell.templateId) {
        return (await PredicateTemplate.ofIdAsync(tell.templateId!)).update(
          tell.formValue.name,
          tell.formValue.description,
          tell.formValue.evalFunctionBody,
          tell.formValue.parameters,
        );
      }

      return PredicateTemplate.create(
        tell.formValue.name,
        tell.formValue.description,
        tell.formValue.evalFunctionBody,
        tell.formValue.parameters,
      );
    })();

    await PredicateTemplate.saveAsync(predicateKind);

    return success({
      predicateKindId: predicateKind.id,
    });
  }

  // TODO: validate predicate kind exists
  // TODO: only allow if predicate kind is unused
  static async deletePredicateKind(tell: DeletePredicateTemplateCommand) {
    const predicateKind = await PredicateTemplate.ofIdAsync(tell.templateId);
    predicateKind.delete();

    await PredicateTemplate.saveAsync(predicateKind);

    return success();
  }
}
