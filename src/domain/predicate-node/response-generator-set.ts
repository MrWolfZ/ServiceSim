import { DomainEvent } from '../../infrastructure';
import { ResponseGeneratorTemplateVersionSnapshot } from './response-generator-template-version-snapshot';

export class ResponseGeneratorSet extends DomainEvent<typeof ResponseGeneratorSet.KIND> {
  predicateNodeId: string;
  responseGeneratorName: string;
  responseGeneratorTemplateVersionSnapshot: ResponseGeneratorTemplateVersionSnapshot;
  parameterValues: { [prop: string]: string | number | boolean };

  static readonly KIND = 'predicate/ResponseGeneratorSet';
  static readonly create = DomainEvent.createBase(ResponseGeneratorSet);
}
