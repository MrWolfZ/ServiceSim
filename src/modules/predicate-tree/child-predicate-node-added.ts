import { DomainEvent } from '../../api-infrastructure';

export class ChildPredicateNodeAdded extends DomainEvent<typeof ChildPredicateNodeAdded.KIND> {
  parentNodeId: string;
  childNodeId: string;

  static readonly KIND = 'predicate/ChildPredicateNodeAdded';
  static readonly create = DomainEvent.createBase(ChildPredicateNodeAdded);
}
