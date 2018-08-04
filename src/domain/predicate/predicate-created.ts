import { DomainEvent } from '../../infrastructure';

export class PredicateCreated extends DomainEvent<typeof PredicateCreated.KIND> {
  predicateId: string;
  predicateKindId: string;
  parameterValues: { [prop: string]: string | number | boolean };
  parentPredicateId: string | undefined;

  static readonly KIND = 'predicate/PredicateCreated';
  static readonly create = DomainEvent.createBase(PredicateCreated);
}
