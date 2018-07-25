import { DomainEvent } from '../../infrastructure';
import { PredicatePropertyDescriptor } from './property-descriptor';

export class PredicateKindCreatedOrUpdated extends DomainEvent<typeof PredicateKindCreatedOrUpdated.KIND> {
  predicateKindId: string;
  name: string;
  description: string;
  evalFunctionBody: string;
  propertyDescriptors: PredicatePropertyDescriptor[];

  static readonly KIND = 'predicate-kind/PredicateKindCreatedOrUpdated';
  static readonly create = DomainEvent.createBase(PredicateKindCreatedOrUpdated);
}
