import { DomainEvent } from '../../infrastructure';
import { Parameter } from '../parameter';

export class ResponseGeneratorKindCreatedOrUpdated extends DomainEvent<typeof ResponseGeneratorKindCreatedOrUpdated.KIND> {
  responseGeneratorKindId: string;
  name: string;
  description: string;
  generatorFunctionBody: string;
  parameters: Parameter[];

  static readonly KIND = 'response-generator-kind/ResponseGeneratorKindCreatedOrUpdated';
  static readonly create = DomainEvent.createBase(ResponseGeneratorKindCreatedOrUpdated);
}
