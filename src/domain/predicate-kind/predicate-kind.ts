import uuid from 'uuid';

import { EntityEventHandlerMap, EventSourcedEntityRepository, EventSourcedRootEntity } from '../../infrastructure';
import { PredicateKindCreated } from './predicate-kind-created';
import { PredicateKindDeleted } from './predicate-kind-deleted';
import { PredicateKindUpdated } from './predicate-kind-updated';
import { PredicatePropertyDescriptorAdded } from './property-descriptor-added';

const JOURNAL_NAME = 'predicate-kind/Journal';

type DomainEvents =
  | PredicateKindCreated
  | PredicateKindDeleted
  | PredicateKindUpdated
  | PredicatePropertyDescriptorAdded
  ;

export interface PredicatePropertyDescriptor {
  name: string;
  description: string;
  isRequired: boolean;
  valueType: 'string' | 'boolean' | 'number';
}

export class PredicateKind extends EventSourcedRootEntity<DomainEvents> {
  name = '';
  description = '';
  propertyDescriptors: PredicatePropertyDescriptor[] = [];
  evalFunctionBody = 'return true;';

  static create(
    name: string,
    description: string,
    evalFunctionBody: string,
  ) {
    return new PredicateKind().apply(PredicateKindCreated.create({
      predicateKindId: `predicate-kind/${uuid()}`,
      name,
      description,
      evalFunctionBody,
    }));
  }

  update(
    name: string,
    description: string,
    evalFunctionBody: string,
  ) {
    return this.apply(PredicateKindUpdated.create({
      predicateKindId: this.id,
      name,
      description,
      evalFunctionBody,
    }));
  }

  delete() {
    return this.apply(PredicateKindDeleted.create({
      predicateKindId: this.id,
    }));
  }

  addPropertyDescriptor = (
    name: string,
    description: string,
    isRequired: boolean,
    valueType: 'string' | 'boolean' | 'number',
  ) => {
    return this.apply(PredicatePropertyDescriptorAdded.create({
      predicateKindId: this.id,
      name,
      description,
      isRequired,
      valueType,
    }));
  }

  EVENT_HANDLERS: EntityEventHandlerMap<DomainEvents> = {
    [PredicateKindCreated.KIND]: event => {
      this.id = event.predicateKindId;
      this.name = event.name;
      this.description = event.description;
    },
    [PredicateKindUpdated.KIND]: event => {
      this.id = event.predicateKindId;
      this.name = event.name;
      this.description = event.description;
    },
    [PredicateKindDeleted.KIND]: () => {
      // nothing to do
    },
    [PredicatePropertyDescriptorAdded.KIND]: event => {
      this.propertyDescriptors.push({
        name: event.name,
        description: event.description,
        isRequired: event.isRequired,
        valueType: event.valueType,
      });
    },
  };

  static readonly fromEvents = EventSourcedRootEntity.fromEventsBase<PredicateKind, DomainEvents>(PredicateKind);
  static readonly ofIdAsync = EventSourcedEntityRepository.entityOfIdAsync(JOURNAL_NAME, PredicateKind.fromEvents);
  static readonly saveAsync = EventSourcedEntityRepository.saveAsync<PredicateKind, DomainEvents>(JOURNAL_NAME);
  static readonly saveSnapshotAsync = EventSourcedEntityRepository.saveSnapshotAsync<PredicateKind, DomainEvents>(JOURNAL_NAME);
}
