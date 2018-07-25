import { PredicateKind, PredicateKindCreated, PredicateKindDeleted, PredicateKindUpdated } from '../../../../domain';
import { EventLog } from '../../../../infrastructure';

import { PredicateKindListItemDto } from './predicate-kind-list/predicate-kind-list-item/predicate-kind-list-item.dto';
import {
  AskForPredicateKindsPageDto,
  DeletePredicateKindCommand,
  PredicateKindsPageDto,
  TellToCreateOrUpdatePredicateKind,
} from './predicate-kinds.dto';

const SUBSCRIBED_EVENT_KINDS: SubscribedEvents['kind'][] = [
  PredicateKindCreated.KIND,
  PredicateKindUpdated.KIND,
  PredicateKindDeleted.KIND,
];

type SubscribedEvents =
  | PredicateKindCreated
  | PredicateKindUpdated
  | PredicateKindDeleted
  ;

let dto: PredicateKindsPageDto = {
  predicateKindList: {
    items: [],
  },
};

// TODO: export object that checks itself whether it is responsible for given ask and tell kinds
export class PredicateKindsApi {
  static start() {
    return EventLog.subscribeToStream<SubscribedEvents>(SUBSCRIBED_EVENT_KINDS, {
      [PredicateKindCreated.KIND]: ev => {
        const newItem: PredicateKindListItemDto = {
          predicateKindId: ev.predicateKindId,
          name: ev.name,
          description: ev.description,
          evalFunctionBody: ev.evalFunctionBody,
        };

        const items = [
          ...dto.predicateKindList.items,
          newItem,
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
      [PredicateKindUpdated.KIND]: ev => {
        const updatedItem: PredicateKindListItemDto = {
          predicateKindId: ev.predicateKindId,
          name: ev.name,
          description: ev.description,
          evalFunctionBody: ev.evalFunctionBody,
        };

        const items = dto.predicateKindList
          .items
          .map(i => i.predicateKindId === ev.predicateKindId ? updatedItem : i)
          .sort((l, r) => l.name.localeCompare(r.name));

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

  static async askForPageDto(_: AskForPredicateKindsPageDto) {
    return dto;
  }

  // TODO: validation
  // TODO: property descriptors
  static async createOrUpdatePredicateKind(command: TellToCreateOrUpdatePredicateKind) {
    const predicateKind =
      !!command.predicateKindId
        ? await PredicateKind.ofIdAsync(command.predicateKindId)
        : PredicateKind.create(
          command.formValue.name,
          command.formValue.description,
          command.formValue.evalFunctionBody,
        );

    await PredicateKind.saveAsync(predicateKind);

    return {
      predicateKindId: predicateKind.id,
    };
  }

  // TODO: validate predicate kind exists
  // TODO: only allow if predicate kind is unused
  static async deletePredicateKind(command: DeletePredicateKindCommand) {
    const predicateKind = await PredicateKind.ofIdAsync(command.predicateKindId);
    predicateKind.delete();

    await PredicateKind.saveAsync(predicateKind);
  }
}
