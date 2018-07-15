import * as de from '../../infrastructure/domain-event';

export const KIND = 'response-generator-kind/PropertyDescriptorAdded';

export interface PropertyDescriptorAdded extends de.DomainEvent<typeof KIND> {
  responseGeneratorKindId: string;
  name: string;
  description: string;
  isRequired: boolean;
  valueType: 'string' | 'boolean' | 'number';
}

export const create = de.create<PropertyDescriptorAdded>(KIND);
