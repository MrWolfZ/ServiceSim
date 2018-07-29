import { DomainEvent } from '../../infrastructure';
import { ResponseGeneratorKindParameter } from './response-generator-kind-parameter';

export class ResponseGeneratorKindCreatedOrUpdated extends DomainEvent<typeof ResponseGeneratorKindCreatedOrUpdated.KIND> {
  responseGeneratorKindId: string;
  name: string;
  description: string;
  generatorFunctionBody: string;
  parameters: ResponseGeneratorKindParameter[];

  static readonly KIND = 'response-generator-kind/ResponseGeneratorKindCreatedOrUpdated';
  static readonly create = DomainEvent.createBase(ResponseGeneratorKindCreatedOrUpdated);
}
