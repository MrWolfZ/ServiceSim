import uuid from 'uuid';

import { EventHandlerMap, EventSourcedEntityRepository, EventSourcedRootEntity } from '../../infrastructure';
import { PredicateKindCreatedOrUpdated } from './predicate-kind-created-or-updated';
import { PredicateKindDeleted } from './predicate-kind-deleted';
import { PredicatePropertyDescriptor } from './property-descriptor';

const JOURNAL_NAME = 'predicate-kind/Journal';

type DomainEvents =
  | PredicateKindCreatedOrUpdated
  | PredicateKindDeleted
  ;

export class PredicateKind extends EventSourcedRootEntity<DomainEvents> {
  name = '';
  description = '';
  propertyDescriptors: PredicatePropertyDescriptor[] = [];
  evalFunctionBody = 'return true;';

  static create(
    name: string,
    description: string,
    evalFunctionBody: string,
    propertyDescriptors: PredicatePropertyDescriptor[],
  ) {
    return new PredicateKind().apply(PredicateKindCreatedOrUpdated.create({
      predicateKindId: `predicate-kind/${uuid()}`,
      name,
      description,
      evalFunctionBody,
      propertyDescriptors,
    }));
  }

  update(
    name: string,
    description: string,
    evalFunctionBody: string,
    propertyDescriptors: PredicatePropertyDescriptor[],
  ) {
    return this.apply(PredicateKindCreatedOrUpdated.create({
      predicateKindId: this.id,
      name,
      description,
      evalFunctionBody,
      propertyDescriptors,
    }));
  }

  delete() {
    return this.apply(PredicateKindDeleted.create({
      predicateKindId: this.id,
    }));
  }

  EVENT_HANDLERS: EventHandlerMap<DomainEvents> = {
    [PredicateKindCreatedOrUpdated.KIND]: event => {
      this.id = event.predicateKindId;
      this.name = event.name;
      this.description = event.description;
      this.evalFunctionBody = event.evalFunctionBody;
      this.propertyDescriptors = event.propertyDescriptors;
    },
    [PredicateKindDeleted.KIND]: () => {
      // nothing to do
    },
  };

  static readonly fromEvents = EventSourcedRootEntity.fromEventsBase<PredicateKind, DomainEvents>(PredicateKind);
  static readonly ofIdAsync = EventSourcedEntityRepository.entityOfIdAsync(JOURNAL_NAME, PredicateKind.fromEvents);
  static readonly saveAsync = EventSourcedEntityRepository.saveAsync<PredicateKind, DomainEvents>(JOURNAL_NAME);
  static readonly saveSnapshotAsync = EventSourcedEntityRepository.saveSnapshotAsync<PredicateKind, DomainEvents>(JOURNAL_NAME);
}
