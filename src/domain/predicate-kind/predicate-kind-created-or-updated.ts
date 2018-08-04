import { DomainEvent } from '../../infrastructure';
import { Parameter } from '../parameter';

export class PredicateKindCreatedOrUpdated extends DomainEvent<typeof PredicateKindCreatedOrUpdated.KIND> {
  predicateKindId: string;
  name: string;
  description: string;
  evalFunctionBody: string;
  parameters: Parameter[];

  static readonly KIND = 'predicate-kind/PredicateKindCreatedOrUpdated';
  static readonly create = DomainEvent.createBase(PredicateKindCreatedOrUpdated);
}
