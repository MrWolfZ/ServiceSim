import { DomainEvent } from '../../infrastructure';

export class PredicateKindDeleted extends DomainEvent<typeof PredicateKindDeleted.KIND> {
  predicateKindId: string;

  static readonly KIND = 'predicate-kind/PredicateKindDeleted';
  static readonly create = DomainEvent.createBase(PredicateKindDeleted);
}
