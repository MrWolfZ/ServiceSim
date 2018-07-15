import { DomainEvent } from '../../infrastructure';

export class PredicateKindCreated extends DomainEvent<typeof PredicateKindCreated.KIND> {
  predicateKindId: string;
  name: string;
  description: string;
  evalFunctionBody: string;

  static readonly KIND = 'predicate-kind/PredicateKindCreated';
  static readonly create = DomainEvent.createBase(PredicateKindCreated);
}
