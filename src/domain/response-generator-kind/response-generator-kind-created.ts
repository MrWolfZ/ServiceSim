import { DomainEvent } from '../../infrastructure';

export class ResponseGeneratorKindCreated extends DomainEvent<typeof ResponseGeneratorKindCreated.KIND> {
  responseGeneratorKindId: string;
  name: string;
  description: string;
  generatorFunctionBody: string;

  static readonly KIND = 'response-generator-kind/ResponseGeneratorKindCreated';
  static readonly create = DomainEvent.createBase(ResponseGeneratorKindCreated);
}
