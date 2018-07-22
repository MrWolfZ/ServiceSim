import { PredicateKind, PredicateKindCreated } from '../../../../domain';
import { EventLog } from '../../../../infrastructure';

import { PredicateKindListItemDto } from './predicate-kind-list/predicate-kind-list-item/predicate-kind-list-item.dto';
import {
  AskForPredicateKindsPageDto,
  CreateNewPredicateKindCommand,
  PredicateKindsPageDto,
} from './predicate-kinds.dto';

const SUBSCRIBED_EVENT_KINDS: SubscribedEvents['kind'][] = [
  PredicateKindCreated.KIND,
];

type SubscribedEvents =
  | PredicateKindCreated
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
        case PredicateKindCreated.KIND:
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
}
