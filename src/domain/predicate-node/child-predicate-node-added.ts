import { DomainEvent } from '../../infrastructure';

export class ChildPredicateNodeAdded extends DomainEvent<typeof ChildPredicateNodeAdded.KIND> {
  parentPredicateId: string;
  childPredicateId: string;

  static readonly KIND = 'predicate/ChildPredicateNodeAdded';
  static readonly create = DomainEvent.createBase(ChildPredicateNodeAdded);
}
