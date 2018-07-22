import { PredicateKind, PredicateKindCreated, PredicateKindDeleted, PredicateKindUpdated } from '../../../../domain';
import { EventLog } from '../../../../infrastructure';

import { PredicateKindListItemDto } from './predicate-kind-list/predicate-kind-list-item/predicate-kind-list-item.dto';
import {
  AskForPredicateKindsPageDto,
  CreateNewPredicateKindCommand,
  DeletePredicateKindCommand,
  PredicateKindsPageDto,
  UpdatePredicateKindCommand,
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

export class PredicateKindsApi {
  static start() {
    return EventLog.getStream<SubscribedEvents>(...SUBSCRIBED_EVENT_KINDS).subscribe(ev => {
      // tslint:disable-next-line:switch-default
      switch (ev.kind) {
        case PredicateKindCreated.KIND: {
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
        }

        case PredicateKindUpdated.KIND: {
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
        }

        case PredicateKindDeleted.KIND: {
          const items = dto.predicateKindList.items.filter(i => i.predicateKindId !== ev.predicateKindId);

          dto = {
            ...dto,
            predicateKindList: {
              ...dto.predicateKindList,
              items,
            },
          };

          return;
        }
      }
    });
  }

  static async askForPageDto(_: AskForPredicateKindsPageDto) {
    return dto;
  }

  // TODO: validation
  // TODO: property descriptors
  static async createNewPredicateKind(command: CreateNewPredicateKindCommand) {
    const newPredicateKind = PredicateKind.create(
      command.formValue.name,
      command.formValue.description,
      command.formValue.evalFunctionBody,
    );

    await PredicateKind.saveAsync(newPredicateKind);

    return {
      predicateKindId: newPredicateKind.id,
    };
  }

  // TODO: validation
  // TODO: property descriptors
  static async updatePredicateKind(command: UpdatePredicateKindCommand) {
    const predicateKind = await PredicateKind.ofIdAsync(command.predicateKindId);

    const updatedPredicateKind = predicateKind.update(
      command.formValue.name,
      command.formValue.description,
      command.formValue.evalFunctionBody,
    );

    await PredicateKind.saveAsync(updatedPredicateKind);
  }

  // TODO: validate predicate kind exists
  // TODO: only allow if predicate kind is unused
  static async deletePredicateKind(command: DeletePredicateKindCommand) {
    const predicateKind = await PredicateKind.ofIdAsync(command.predicateKindId);
    predicateKind.delete();

    await PredicateKind.saveAsync(predicateKind);
  }
}
