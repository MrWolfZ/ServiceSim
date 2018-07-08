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
