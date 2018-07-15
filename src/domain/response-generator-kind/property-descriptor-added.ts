import { DomainEvent } from '../../infrastructure';

export class ResponseGeneratorPropertyDescriptorAdded extends DomainEvent<typeof ResponseGeneratorPropertyDescriptorAdded.KIND> {
  responseGeneratorKindId: string;
  name: string;
  description: string;
  isRequired: boolean;
  valueType: 'string' | 'boolean' | 'number';

  static readonly KIND = 'response-generator-kind/PropertyDescriptorAdded';
  static readonly create = DomainEvent.createBase(ResponseGeneratorPropertyDescriptorAdded);
}
