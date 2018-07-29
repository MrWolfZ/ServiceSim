import { DomainEvent } from '../../infrastructure';

export class ChildPredicateAdded extends DomainEvent<typeof ChildPredicateAdded.KIND> {
  parentPredicateId: string;
  childPredicateId: string;

  static readonly KIND = 'predicate/ChildPredicateAdded';
  static readonly create = DomainEvent.createBase(ChildPredicateAdded);
}
