import { DomainEvent } from '../../infrastructure';
import { PredicateKindVersionSnapshot } from './predicate-kind-version-snapshot';

export class PredicateNodeCreated extends DomainEvent<typeof PredicateNodeCreated.KIND> {
  nodeId: string;
  predicateKindVersionSnapshot: PredicateKindVersionSnapshot;
  parameterValues: { [prop: string]: string | number | boolean };
  parentPredicateNodeId: string | undefined;

  static readonly KIND = 'predicate/PredicateCreated';
  static readonly create = DomainEvent.createBase(PredicateNodeCreated);
}
