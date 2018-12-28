import { DomainEvent } from '../../api-infrastructure';
import { ResponseGeneratorCustomProperties, ResponseGeneratorTemplateInfo } from './template-info-or-custom-properties';

export class ResponseGeneratorSet extends DomainEvent<typeof ResponseGeneratorSet.KIND> {
  predicateNodeId: string;
  responseGeneratorName: string;
  responseGeneratorDescription: string;
  templateInfoOrCustomProperties: ResponseGeneratorTemplateInfo | ResponseGeneratorCustomProperties;

  static readonly KIND = 'predicate/ResponseGeneratorSet';
  static readonly create = DomainEvent.createBase(ResponseGeneratorSet);
}
