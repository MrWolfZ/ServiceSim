import { DomainEvent } from '../../infrastructure';

export class PredicatePropertyDescriptorAdded extends DomainEvent<typeof PredicatePropertyDescriptorAdded.KIND> {
  predicateKindId: string;
  name: string;
  description: string;
  isRequired: boolean;
  valueType: 'string' | 'boolean' | 'number';

  static readonly KIND = 'predicate-kind/PropertyDescriptorAdded';
  static readonly create = DomainEvent.createBase(PredicatePropertyDescriptorAdded);
}
