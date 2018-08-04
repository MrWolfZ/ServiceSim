import { DomainEvent } from '../../infrastructure';
import { Parameter } from '../parameter';

export class ResponseGeneratorTemplateCreatedOrUpdated extends DomainEvent<typeof ResponseGeneratorTemplateCreatedOrUpdated.KIND> {
  templateId: string;
  name: string;
  description: string;
  generatorFunctionBody: string;
  parameters: Parameter[];

  static readonly KIND = 'response-generator-template/ResponseGeneratorTemplateCreatedOrUpdated';
  static readonly create = DomainEvent.createBase(ResponseGeneratorTemplateCreatedOrUpdated);
}
