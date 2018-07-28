import { DomainEvent } from '../../infrastructure';
import { PredicateKindParameter } from './predicate-kind-parameter';

export class PredicateKindCreatedOrUpdated extends DomainEvent<typeof PredicateKindCreatedOrUpdated.KIND> {
  predicateKindId: string;
  name: string;
  description: string;
  evalFunctionBody: string;
  parameters: PredicateKindParameter[];

  static readonly KIND = 'predicate-kind/PredicateKindCreatedOrUpdated';
  static readonly create = DomainEvent.createBase(PredicateKindCreatedOrUpdated);
}
