export interface PredicatePropertyDescriptorDto {
  name: string;
  description: string;
  isRequired: boolean;
  valueType: 'string' | 'boolean' | 'number';
}

export interface PredicateKindListItemDto {
  predicateKindId: string;
  name: string;
  description: string;
  evalFunctionBody: string;
  propertyDescriptors: PredicatePropertyDescriptorDto[];
}

export interface PredicatePropertyDescriptorFormValue {
  name: string;
  description: string;
  isRequired: boolean;
  valueType: 'string' | 'boolean' | 'number';
}

export interface PredicateKindListItemFormValue {
  name: string;
  description: string;
  evalFunctionBody: string;
  propertyDescriptors: PredicatePropertyDescriptorFormValue[];
}
