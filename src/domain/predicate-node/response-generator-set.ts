import { DomainEvent } from '../../infrastructure';
import { ResponseGeneratorTemplateVersionSnapshot } from './response-generator-kind-version-snapshot';

export class ResponseGeneratorSet extends DomainEvent<typeof ResponseGeneratorSet.KIND> {
  predicateNodeId: string;
  responseGeneratorTemplateVersionSnapshot: ResponseGeneratorTemplateVersionSnapshot;
  parameterValues: { [prop: string]: string | number | boolean };

  static readonly KIND = 'predicate/ResponseGeneratorSet';
  static readonly create = DomainEvent.createBase(ResponseGeneratorSet);
}
