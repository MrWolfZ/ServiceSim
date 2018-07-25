import { createFormGroupState } from 'ngrx-forms';

import { PredicateKind, PredicateKindCreatedOrUpdated, PredicateKindDeleted } from '../../../../domain';
import { EventLog, failure, success } from '../../../../infrastructure';

import { Ask, Tell } from '../../infrastructure/infrastructure.dto';
import { PredicateKindListItemDto } from './predicate-kind-list/predicate-kind-list-item/predicate-kind-list-item.dto';
import { validatePredicateKindListItem } from './predicate-kind-list/predicate-kind-list-item/predicate-kind-list-item.validation';
import {
  ASK_FOR_PREDICATE_KINDS_PAGE_DTO,
  AskForPredicateKindsPageDto,
  DeletePredicateKindCommand,
  PredicateKindsPageDto,
  TELL_TO_CREATE_OR_UPDATE_PREDICATE_KIND,
  TELL_TO_DELETE_PREDICATE_KIND,
  TellToCreateOrUpdatePredicateKind,
} from './predicate-kinds.dto';

const SUBSCRIBED_EVENT_KINDS: SubscribedEvents['kind'][] = [
  PredicateKindCreatedOrUpdated.KIND,
  PredicateKindDeleted.KIND,
];

type SubscribedEvents =
  | PredicateKindCreatedOrUpdated
  | PredicateKindDeleted
  ;

let dto: PredicateKindsPageDto = {
  predicateKindList: {
    items: [],
  },
};

export class PredicateKindsApi {
  static start() {
    return EventLog.subscribeToStream<SubscribedEvents>(SUBSCRIBED_EVENT_KINDS, {
      [PredicateKindCreatedOrUpdated.KIND]: ev => {
        const item: PredicateKindListItemDto = {
          predicateKindId: ev.predicateKindId,
          name: ev.name,
          description: ev.description,
          evalFunctionBody: ev.evalFunctionBody,
          propertyDescriptors: ev.propertyDescriptors,
        };

        const items = [
          ...dto.predicateKindList.items.filter(i => i.predicateKindId !== item.predicateKindId),
          item,
        ].sort((l, r) => l.name.localeCompare(r.name));

        dto = {
          ...dto,
          predicateKindList: {
            ...dto.predicateKindList,
            items,
          },
        };

        return;
      },
      [PredicateKindDeleted.KIND]: ev => {
        const items = dto.predicateKindList.items.filter(i => i.predicateKindId !== ev.predicateKindId);

        dto = {
          ...dto,
          predicateKindList: {
            ...dto.predicateKindList,
            items,
          },
        };

        return;
      },
    });
  }

  static async matchAsk(ask: Ask<string, any>) {
    switch (ask.kind) {
      case ASK_FOR_PREDICATE_KINDS_PAGE_DTO:
        return success(dto);

      default:
        return failure();
    }
  }

  static async askForPageDto(_: AskForPredicateKindsPageDto) {
    return dto;
  }

  static async matchTell(tell: Tell<string, any>) {
    switch (tell.kind) {
      case TELL_TO_CREATE_OR_UPDATE_PREDICATE_KIND:
        return success(await PredicateKindsApi.createOrUpdatePredicateKind(tell as TellToCreateOrUpdatePredicateKind));

      case TELL_TO_DELETE_PREDICATE_KIND:
        return success(await PredicateKindsApi.deletePredicateKind(tell as DeletePredicateKindCommand));

      default:
        return failure();
    }
  }

  static async createOrUpdatePredicateKind(tell: TellToCreateOrUpdatePredicateKind) {
    const isValid = validatePredicateKindListItem(createFormGroupState('', tell.formValue)).isValid;

    if (!isValid) {
      return failure();
    }

    const predicateKind = await (async () => {
      if (!!tell.predicateKindId) {
        return (await PredicateKind.ofIdAsync(tell.predicateKindId!)).update(
          tell.formValue.name,
          tell.formValue.description,
          tell.formValue.evalFunctionBody,
          tell.formValue.propertyDescriptors,
        );
      }

      return PredicateKind.create(
        tell.formValue.name,
        tell.formValue.description,
        tell.formValue.evalFunctionBody,
        tell.formValue.propertyDescriptors,
      );
    })();

    await PredicateKind.saveAsync(predicateKind);

    return success({
      predicateKindId: predicateKind.id,
    });
  }

  // TODO: validate predicate kind exists
  // TODO: only allow if predicate kind is unused
  static async deletePredicateKind(tell: DeletePredicateKindCommand) {
    const predicateKind = await PredicateKind.ofIdAsync(tell.predicateKindId);
    predicateKind.delete();

    await PredicateKind.saveAsync(predicateKind);

    return success();
  }
}
