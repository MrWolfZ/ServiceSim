import { Command } from '../infrastructure/ddd';

export interface RequestMatcherPropertyDescriptor {
  name: string;
  description: string;
  isRequired: boolean;
  valueType: 'string' | 'boolean' | 'number';
}

export interface RequestMatcherType {
  name: string;
  description: string;
  propertyDescriptors: RequestMatcherPropertyDescriptor[];
}

export interface CreateRequestMatcherType extends Command {
  name: string;
  description: string;
  propertyDescriptors: RequestMatcherPropertyDescriptor[];
}

export interface RequestMatcherTypeCreated {
  name: string;
  description: string;
  propertyDescriptors: RequestMatcherPropertyDescriptor[];
}
