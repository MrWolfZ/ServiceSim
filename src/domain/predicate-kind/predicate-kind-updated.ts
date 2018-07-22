import { DomainEvent } from '../../infrastructure';

export class PredicateKindUpdated extends DomainEvent<typeof PredicateKindUpdated.KIND> {
  predicateKindId: string;
  name: string;
  description: string;
  evalFunctionBody: string;

  static readonly KIND = 'predicate-kind/PredicateKindUpdated';
  static readonly create = DomainEvent.createBase(PredicateKindUpdated);
}
