import * as de from '../../infrastructure/domain-event';

export const KIND = 'predicate-kind/PropertyDescriptorAdded';

export interface PropertyDescriptorAdded extends de.DomainEvent<typeof KIND> {
  predicateKindId: string;
  name: string;
  description: string;
  isRequired: boolean;
  valueType: 'string' | 'boolean' | 'number';
}

export const create = de.create<PropertyDescriptorAdded>(KIND);
