import { DomainEvent } from '../../infrastructure';

export class PredicateNodeCreated extends DomainEvent<typeof PredicateNodeCreated.KIND> {
  nodeId: string;
  predicateKindId: string;
  parameterValues: { [prop: string]: string | number | boolean };
  parentPredicateNodeId: string | undefined;

  static readonly KIND = 'predicate/PredicateCreated';
  static readonly create = DomainEvent.createBase(PredicateNodeCreated);
}
