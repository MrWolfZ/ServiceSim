import { DomainEvent } from '../../infrastructure';

export class ResponseGeneratorCreated extends DomainEvent<typeof ResponseGeneratorCreated.KIND> {
  responseGeneratorId: string;
  responseGeneratorKindId: string;
  properties: { [prop: string]: string | number | boolean };

  static readonly KIND = 'response-generator/ResponseGeneratorCreated';
  static readonly create = DomainEvent.createBase(ResponseGeneratorCreated);
}
